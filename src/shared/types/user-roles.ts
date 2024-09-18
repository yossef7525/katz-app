import { Entity, Fields } from "remult";
import { Roles } from "./roles";

@Entity("userRoles", {
    allowApiCrud: Roles.DevOps,
    allowApiRead: Roles.User
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