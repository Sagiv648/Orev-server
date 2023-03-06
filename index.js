import mongoose from "mongoose";
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import dbContext from "./config/dbContext.js";
import https from 'https'
import http from 'http'
import certifcate from "./config/certifcate.js";
import jwt from 'jsonwebtoken'
import { exit } from "process";
import users from './Models/user.js'
import { auth } from "./Controllers/Auth/auth.js";

import profileRouter from "./Controllers/Profile/profile.js";
import unitCmdrsRouter from "./Controllers/UnitCmdrs/unitCmdrs.js";
import fallenRouter from "./Controllers/Fallen/fallen.js";
import adminRouter from "./Controllers/Admin/admin.js";
import usersRouter from "./Controllers/Users/users.js";
import eventsRouter from "./Controllers/Events/event.js";
import Event from "./Models/event.js";
import cron from 'node-cron'
import { __dirname } from "./utils.js";


const app = express()
dotenv.config()
dbContext()



app.use('/files', express.static('files'))
//authorization: Bearer [token]
cron.schedule(' 0 0 * * *', async () => {
    
    try {
        const allEvents = await Event.find({})
        allEvents.map(x => (Date.parse(x.date) - Date.now()) <= 0 && x.delete())
        console.log("Events was cleared");
    } catch (error) {
        console.log("Error:\n" + error.message);
    }
    
    
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/profile',auth,profileRouter)
app.use('/unitcmdrs',auth, unitCmdrsRouter)
app.use('/fallen', auth, fallenRouter)
app.use('/users', auth, usersRouter)
app.use('/events', auth, eventsRouter)

app.use('/admin', adminRouter)
app.post('/login', async (req,res) => {
    //authorization
    const email = req.body.email;
    const password = req.body.password
    
    const user = await users.findOne({email: email}).exec()
    if(!user)
    return res.status(401).json({error: "user error"})

    
    if(user.password != password)
    return res.status(401).json({error: "user error"})
    
    const toTokenize = {
        id: user.id
    }
    const token = jwt.sign(toTokenize,process.env.SECRET)
    res.status(200).json({token: token})
})


app.post('/register', async (req,res) => {
    const email = req.body.email;
    const password = req.body.password

    const user = await users.findOne({email: email}).exec()
    if(user)
    return res.status(400).json({error: "exists"})

    const created = await users.create({
                                        email: email,
                                        password: password,
                                        })
    if(created){
        const toTokenize = {
        id: created.id
    }
    const token = jwt.sign(toTokenize,process.env.SECRET)
    res.status(201).json({token: token})
    }
    else{
        res.status(500).json({Error: "Server couldn't create resource."})
    }

})


app.use((req,res) => {
    return res.status(404).json({Error: "Resource not found"})
})

mongoose.connection.once('open', () => {

    try {
        https.createServer(certifcate, app).listen(process.env.PORT | 443)
        http.createServer(app).listen(process.env.PORT | 80)
    } catch (error) {
        console.log(`Error at:\n${error.message}`);
        exit()
    }
    
})

mongoose.connection.on('error', (err) => {
    console.log(err);
    exit()
})

