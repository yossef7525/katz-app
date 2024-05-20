import { ArrayEntityDataProvider, Entity, Fields, Filter, Relations } from "../remult";
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
    neighborhood!:string
   
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
    
    @Fields.number()
    order?:number
    
    @Fields.boolean()
    active?:boolean
    
    
    @Relations.toMany(() => Deliveries)
    deliveries?: Deliveries[]
    static userNameFilter = Filter.createCustom<People, {query:string}>(
        async ({query}) => {
        return ArrayEntityDataProvider.rawFilter((user:any) => {
         return user.group !== '' && `${user.lastName} ${user.firstName}`.includes(query)
        })
      });
}


export interface PeopleExcel extends People{
    phone: string,
    phone2:string,
    phone3:string,
  };