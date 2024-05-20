import { BackendMethod, remult } from '../remult';
import { People } from '../types';
import { Roles } from '../types/roles';

const peoplesRepo = remult.repo(People);

export class SortedController {
  @BackendMethod({ allowed: Roles.User })
  static async updateSorted(list:{id:string, order:number}[]) {
    for (let people of list) {
       await peoplesRepo.update(people.id, {order: people.order})
    }
    return {msg: 'success'}
  }
}
