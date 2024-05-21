import { remultExpress } from 'remult/remult-express'
import { Deliveries, People } from '../shared/types'
import { Distributes } from '../shared/types/distributes'
import { DistributesController } from '../shared/controllers/distributes.controller'
import { Archive } from '../shared/types/archive'
import { SortedController } from '../shared/controllers/sorted.controller'
import { UserRoles } from '../shared/types/user-roles'
import { AuthController } from '../shared/controllers/auth.controller'
import { PeopleController } from '../shared/controllers/people.controller'
import {Comment} from '../shared/types'

export const api = remultExpress({
    getUser: req => req.session!["user"],
    entities: [People, Deliveries, Distributes, Archive, UserRoles, Comment],
    controllers: [DistributesController, SortedController, AuthController, PeopleController]
})