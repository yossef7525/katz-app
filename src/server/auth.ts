import express, { Router } from "express"
import { remult, type UserInfo } from "remult"
import { remultExpress } from "remult/remult-express"
import { UserRoles } from "../shared/types/user-roles"
import crypto from 'crypto-js'
import {api} from './api';


const validUsers = remult.repo(UserRoles)

export const auth = Router()

auth.use(express.json())

auth.post("/api/signIn", api.withRemult, async (req, res) => {

    const user = (await validUsers.find({ where: { name: req.body.username } }))[0]
    
    if (!user || req.body.password !== validPassword(user.pass)) {
        res.status(404).json("Invalid username Or Password")
        return
    }
    else {
        await validUsers.update(`${user.id}`, {...user, lastLogin: new Date()})
        req.session!["user"] = user
        res.json(user)
    }
})


auth.post("/api/signOut", api.withRemult, (req, res) => {
    req.session!["user"] = null
    res.json("signed out")
})

auth.get("/api/currentUser", (req, res) => res.json(req.session!["user"]))

const salt = "77f943e24c0e345e75d6bd7ce501eabf"


function validPassword(hash: string) {
    const bytes = crypto.AES.decrypt(hash, salt);
    return bytes.toString(crypto.enc.Utf8)
}