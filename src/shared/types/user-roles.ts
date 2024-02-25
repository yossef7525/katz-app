import { Entity, Fields } from "remult";
import { Roles } from "./roles";

@Entity("userRoles", {
    allowApiCrud: true,
    allowApiRead: true
})
export class UserRoles {
    @Fields.cuid()
    id? = ""

    @Fields.string()
    name = ""

    @Fields.string()
    pass = ""

    @Fields.date()
    lastLogin ? :Date

    @Fields.json()
    roles!:string[]
}