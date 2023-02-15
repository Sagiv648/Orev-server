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
import users from './Models/User.js'
import { auth } from "./Controllers/Auth/auth.js";
import { privilegedAuth } from "./Controllers/Admin/adminAuth.js";
import profileRouter from "./Controllers/Profile/profile.js";
import unitCmdrsRouter from "./Controllers/UnitCmdrs/unitCmdrs.js";
import fallenRouter from "./Controllers/Fallen/fallen.js";
import adminRouter from "./Controllers/Admin/admin.js";
const app = express()
dotenv.config()
dbContext()


//authorization: Bearer [token]

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/profile',auth,profileRouter)
app.use('/unitcmdrs',auth, unitCmdrsRouter)
app.use('/fallen', auth, fallenRouter)
app.use('/admin', auth,privilegedAuth, adminRouter)
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

        id: user.id,
        privilege: {
            privilege_ring: user.privilege.privilege_ring,
            privilege_id: user.privilege.privilege_id
        },
        privileged_token: false,
        
    }
    console.log(toTokenize);
    const token = jwt.sign(toTokenize,process.env.SECRET)
    res.status(200).json({token: token})
})


//TODO: Write to firebase aswell
app.post('/register', async (req,res) => {
    const email = req.body.email;
    const password = req.body.password

    const user = await users.findOne({email: email}).exec()
    if(user)
    return res.status(400).json({error: "exists"})

    const created = await users.create({first_name: "N/A",
                                        last_name: "N/A",
                                        email: email,
                                        password: password,
                                        privilege: {
                                            privilege_ring: 2,
                                            privilege_id: "",
                                            privilege_password: ""
                                        },
                                        phone_number: "N/A",
                                        recruitment_class: "N/A",
                                        city: "N/A",
                                        occupation: "N/A",
                                        volunteering: "N/A",
                                        linkedin_link: "N/A",
                                        facebook_link: "N/A",
                                        github_link: "N/A",
                                        instagram_link: "N/A",
                                        picture: ""})
    if(created){
        const toTokenize = {
        id: created.id,
        privilege: {
            privilege_ring: created.privilege.privilege_ring,
            privilege_id: created.privilege.privilege_id
        },
        privileged_token: false
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

