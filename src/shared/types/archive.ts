import { Entity } from "remult";
import { Deliveries } from "./deliverie";
import { Roles } from "./roles";

@Entity('archive', {
    allowApiCrud: Roles.User
})
export class Archive extends Deliveries{}