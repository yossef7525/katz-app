import { Entity, Fields } from "remult";

@Entity('distributes', {
    allowApiCrud: true
})
export class Distributes{
    @Fields.cuid()
    id?:string

    @Fields.string()
    name?:string

    @Fields.boolean()
    archive?:boolean

    @Fields.createdAt()
    createAt?:Date

}