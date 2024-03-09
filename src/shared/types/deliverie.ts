import { ArrayEntityDataProvider, Entity, Fields, Filter, Relations } from "../remult";
import { People } from "./people";

@Entity('deliveries', {
    allowApiCrud: true
})
export class Deliveries {
    @Fields.autoIncrement()
    id!:string

    @Fields.string()
    peopleId!: string;
    
    @Relations.toOne(() => People, {
        field: "peopleId",
      })
    people?: People;

    @Fields.string()
    distributeId!:string

    @Fields.createdAt()
    createdAt?:Date

    @Fields.updatedAt()
    updatedAt?:Date

    @Fields.number()
    count?:number

    @Fields.json()
    status!:statusList[]
   
    @Fields.string()
    updatePhone?:string

    static statusFilter = Filter.createCustom<Deliveries, {query:Statuses}>(
        async ({query}) => {
        return ArrayEntityDataProvider.rawFilter((deliveries:Deliveries) => {
         return deliveries.status.findIndex(st => st.status === query) > -1
        })
    });
}


export enum Statuses{
    Absorbed = "נקלט",
    Out = "יצא מהמחסן",
    Building = "הגיע לבנין",
    Delivered = 'הגיע לדירה'
}
export class statusList {
    status?:Statuses
    createdAt?:Date
    updatePhone?:string
}