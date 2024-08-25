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
    phoneUpdate?:string
    
    @Fields.string()
    comment?:string
    
    @Fields.json()
    payload?:payload[]
   
    @Fields.boolean()
    complate?:boolean

    @Fields.createdAt()
    createdAt?:Date

    @Fields.boolean()
    isDeleted?:boolean
    call?:boolean
}
export class payload{
    key!: string
    value!: string
}