import { Distributes } from '../types/distributes';
import { Deliveries, People, Statuses } from '../types';
import { Archive } from '../types/archive';
import { BackendMethod, EntityFilter, MembersOnly, remult } from 'remult';
import { Roles } from '../types/roles';

const distributesRepo = remult.repo(Distributes);
const deliveriesRepo = remult.repo(Deliveries);
const archiveRepo = remult.repo(Archive);
const peoplesRepo = remult.repo(People);

export class DistributesController {

  @BackendMethod({ allowed: Roles.User })
  static async addDistribute(distributes: string): Promise<Distributes> {
    console.log('distributesRepo: ', distributes);

    const newDistributes = await distributesRepo.insert({name: distributes, archive: false});

    const peoples = await peoplesRepo.find({ where: { active: true }, orderBy: { order: 'asc' } });

    let deliveries:Partial<MembersOnly<Deliveries>>[] = [];
    peoples.forEach((p) => {
      deliveries = [
        ...deliveries,
        {
          id: p.id,
          people: p,
          peopleId: p.id,
          distributeId: `${newDistributes.id}`,
          updatePhone: 'נוצר אוטומטי',
          count: p.poultry,
          status: [
            {
              status: Statuses.Absorbed,
              createdAt: new Date(),
              updatePhone: 'אתר',
            },
          ],
        },
      ];
    });
    await deliveriesRepo.insert(deliveries.filter(d => d.count && d.count > 0));
    return newDistributes;
  }


  @BackendMethod({ allowed: Roles.User })
  static async moveToArchive(
    distributeId: string
  ): Promise<Distributes | undefined> {
    try {
      const deliveries = await deliveriesRepo.find({ where: { distributeId } });
      await archiveRepo.insert(
        deliveries.map(
          ({
            count,
            distributeId,
            peopleId,
            status,
            updatePhone,
            createdAt,
            updatedAt,
          }) => ({
            count,
            distributeId,
            peopleId,
            status,
            updatePhone,
            createdAt,
            updatedAt,
          })
        )
      );
      for (let deliverie of deliveries) {
        await deliveriesRepo.delete(`${deliverie.id}`);
      }
      const res = await distributesRepo.update(distributeId, { archive: true });
      // reset poultryNextMonth
      peoplesRepo.updateMany({}, {poultryNextMonth: 0})

      return res;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  @BackendMethod({allowed: Roles.User})
  static async updateStatusMany(options:{where:EntityFilter<Deliveries>, statusToUpdate:Statuses}){
    
    const del = await deliveriesRepo.find({where: options.where})
    const delToUpdate = del.filter(item => item.status.findIndex(st => st.status === options.statusToUpdate) === -1)

    for(let row of delToUpdate){
     await deliveriesRepo.update(row.id, {
        ...row,
        status: [{status: options.statusToUpdate, createdAt: new Date(), updatePhone: 'אתר'}, ...row.status]
      })
    }
    return {msg: 'success'}
  }
  
  @BackendMethod({allowed: true})
  static async setDeliveried(options:{isDeliveried:boolean, id:string}){
    
    const del = await deliveriesRepo.findOne({where: {id:options.id}}) as Deliveries

    if(options.isDeliveried){
      if(del.status.findIndex(s => s.status === Statuses.Delivered) > -1) return;
      await deliveriesRepo.update(del.id, {
        ...del,
        status: [{status: Statuses.Delivered, createdAt: new Date(), updatePhone: 'אתר'}, ...del.status]
      })
    } else {
      if(del.status.findIndex(s => s.status === Statuses.Delivered) === -1) return;
      await deliveriesRepo.update(del.id, {
        ...del,
        status: [...del.status.filter(s => s.status !== Statuses.Delivered)]
      })
    }
    return {msg: 'success'}
  }
}
