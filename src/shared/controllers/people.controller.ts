import { BackendMethod, remult } from "../remult";
import { People } from "../types";
import { Roles } from "../types/roles";
export class PeopleController {
    
    @BackendMethod({allowed: Roles.User})
    static async importPeopleFromExcelFile(peoples:People[]){
       const res = await remult.repo(People).insert(peoples);
       return res
      }
      
      
    @BackendMethod({allowed: Roles.User})
    static async updatePeopleFromExcelFile(peoples:People[]){
        const repo = remult.repo(People)
        
        for (let people of peoples) {
           try {
            
              await repo.update(people.id, people)
           } catch (error) {
            console.log('not updated');
            
           }
        }
       const res = {msg: 'success'};
       return res
    }
}