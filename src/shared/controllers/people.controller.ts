import { BackendMethod, remult } from "../remult";
import { People } from "../types";
export class PeopleController {
    
    @BackendMethod({allowed: true})
    static async importPeopleFromExcelFile(peoples:People[]){
       const res = await remult.repo(People).insert(peoples);
       return res
    }
}