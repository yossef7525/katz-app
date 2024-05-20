import { Entity, Fields } from "../remult";
import { Roles } from "./roles";

@Entity('distributes', {
    allowApiCrud: Roles.User
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