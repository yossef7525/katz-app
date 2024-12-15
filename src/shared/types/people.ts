import { ArrayEntityDataProvider, Entity, EntityFilter, Fields, Filter, Relations, remult } from "remult";
import { Deliveries } from "./deliverie";
import { Roles } from "./roles";

@Entity("peoples", {
    allowApiCrud: Roles.User
})

export class People {

    @Fields.cuid()
    id!:string

    @Fields.string()
    firstName!:string

    @Fields.string()
    lastName!:string
    
    @Fields.string()
    address!:string
    
    @Fields.string()
    neighborhood?:string
   
    @Fields.string()
    building!:string
   
    @Fields.string()
    floor!:string
   
    @Fields.string()
    apartment!:string

    @Fields.json<Array<string>>()
    phones!:string[]

    @Fields.number()
    children!:number

    @Fields.number()
    poultry!:number
   
    @Fields.number()
    poultryNextMonth?:number
    
    @Fields.string()
    gabaiCode!:string
    
    @Fields.string()
    cosher?:string

    @Fields.json()
    cosherListOneLevel?:string[]
    
    @Fields.json()
    cosherListTwoLevel?:string[]
    
    @Fields.number()
    order?:number
    
    @Fields.boolean()
    active?:boolean
    
    
    @Relations.toMany(() => Deliveries)
    deliveries?: Deliveries[]
}



export interface PeopleExcel extends People{
    phone: string,
    phone2:string,
    phone3:string,
  };