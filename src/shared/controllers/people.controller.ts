import { BackendMethod, remult } from "../remult";
import { People } from "../types";
export class PeopleController {
    
    @BackendMethod({allowed: true})
    static async importPeopleFromExcelFile(peoples:People[]){
       const res = await remult.repo(People).insert(peoples);
       return res
      }
      
      
    @BackendMethod({allowed: true})
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