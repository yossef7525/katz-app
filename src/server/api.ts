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
import { CommentsController } from '../shared/controllers/comments.controller'
import { SheetSyncController } from '../shared/controllers/sheet-sync.controller'
import { MongoDataProvider } from "remult/remult-mongo"
import { MongoClient } from 'mongodb'
import { remult } from 'remult'
import { Roles } from '../shared/types/roles'


export const api = remultExpress({
    getUser: req => req.session!["user"],
    dataProvider: async () => {
        const client = new MongoClient('mongodb://localhost:27017')
        await client.connect()
        return new MongoDataProvider(client.db('katz'), client, {disableTransactions: true})
    },
    admin: () => remult.isAllowed(Roles.DevOps),
    entities: [People, Deliveries, Distributes, Archive, UserRoles, Comment],
    controllers: [DistributesController, SortedController, AuthController, PeopleController, CommentsController, SheetSyncController]
})