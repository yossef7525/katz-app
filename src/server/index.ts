import express from 'express'
import { api } from "./api"
import { auth } from "./auth"
import path from "path"

import YemotRouts from './yemot-api'
import Yemot2 from './yemot-router'
import session from "cookie-session"


const app = express()
app.use(
    session({
      secret: process.env["SESSION_SECRET"] || "my secret"
    })
  )
app.use(api)
app.use(auth)
app.use('/yemot', YemotRouts)
app.use('/yemot2', api.withRemult, Yemot2.asExpressRouter)

app.use(express.static(path.join(__dirname, "../katz-app")))
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../katz-app", "index.html"))
})


app.listen(3002, () => console.log('Server started'))
        