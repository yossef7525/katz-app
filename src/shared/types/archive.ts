import { Entity, Fields } from "../remult";
import { Deliveries } from "./deliverie";

@Entity('archive', {
    allowApiCrud: true
})
export class Archive extends Deliveries{}