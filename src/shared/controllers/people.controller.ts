import { BackendMethod, remult } from "../remult";
import { People } from "../types";
import { Roles } from "../types/roles";
export class PeopleController {
    
    @BackendMethod({allowed: Roles.User})
    static async importPeopleFromExcelFile(peoples:People[]){
      const repo = remult.repo(People)
      const idsExist = (await repo.find()).map(p => p.id)
      const newPeoples = peoples.filter(p => !idsExist.includes(p.id))
      const updatedPeoples = peoples.filter(p => idsExist.includes(p.id))
       const res = await repo.insert(newPeoples);
       for (let people of updatedPeoples) {
         try {
         await repo.update(people.id, people)
         } catch (error) {
          console.log('not updated');
         }
      }
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