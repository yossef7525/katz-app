import { Entity, Fields } from "remult";

@Entity('comment', {
    allowApiCrud: true
})
export class Comment{
    @Fields.cuid()
    id?:string
   
    @Fields.string()
    peopleId?:string
    
    @Fields.string()
    comment?:string
    
    @Fields.json()
    payload?:payload[]
}
export class payload{
    key!: string
    value!: string
}