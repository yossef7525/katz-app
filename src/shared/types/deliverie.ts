import { Entity, Fields, Relations } from "../remult";
import { People } from "./people";

@Entity('deliveries', {
    allowApiCrud: true
})
export class Deliveries {
    @Fields.autoIncrement()
    id?:string

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