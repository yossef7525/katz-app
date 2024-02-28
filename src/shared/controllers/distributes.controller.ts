import { Distributes } from '../types/distributes';
import { Deliveries, People, Statuses } from '../types';
import { Archive } from '../types/archive';
import { BackendMethod, remult } from '../remult';

const distributesRepo = remult.repo(Distributes);
const deliveriesRepo = remult.repo(Deliveries);
const archiveRepo = remult.repo(Archive);
const peoplesRepo = remult.repo(People);

export class DistributesController {

  @BackendMethod({ allowed: true })
  static async addDistribute(distributes: string): Promise<Distributes> {
    console.log('distributesRepo: ', distributes);

    const newDistributes = await distributesRepo.insert({name: distributes, archive: false});

    const peoples = await peoplesRepo.find({ where: { active: true }, orderBy: { order: 'asc' } });

    let deliveries: Deliveries[] = [];
    peoples.forEach((p) => {
      deliveries = [
        ...deliveries,
        {
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
    await deliveriesRepo.insert(deliveries);
    return newDistributes;
  }


  @BackendMethod({ allowed: true })
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
      return res;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
}
