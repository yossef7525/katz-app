import { BackendMethod, remult } from "../remult";
import { Roles } from "../types/roles";
import { UserRoles } from "../types/user-roles";
import crypto from 'crypto-js'


export class AuthController {
    @BackendMethod( {allowed: Roles.DevOps} )
    static async insertUser(name:string, pass:string, roles:Roles[]) {
        const userRolesRepo = remult.repo(UserRoles)
        const newUser = userRolesRepo.insert({ name, roles, pass: passToHash(pass) })
        return newUser
    }

}
function passToHash(pass: string) {
    const salt = "77f943e24c0e345e75d6bd7ce501eabf"
    const hash = crypto.AES.encrypt(pass, salt).toString()
    return hash
}