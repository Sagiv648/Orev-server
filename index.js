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
import { auth, emailAuth, passwordRestorationAuth, adminAuth, adminAccessAuth } from "./Controllers/Auth/auth.js";
import profileRouter from "./Controllers/Profile/profile.js";
import unitCmdrsRouter from "./Controllers/UnitCmdrs/unitCmdrs.js";
import fallenRouter from "./Controllers/Fallen/fallen.js";
import adminRouter from "./Controllers/Admin/admin.js";
import usersRouter from "./Controllers/Users/users.js";
import eventsRouter from "./Controllers/Events/event.js";
import mentorRouter from "./Controllers/Mentor/mentor.js";
import admin from "./Models/admin.js";
import event from "./Models/event.js";
import cron from 'node-cron'
import { __dirname, sendEmail,readFileSync,randomBytes } from "./utils.js";
import cors from 'cors'

const app = express()
dotenv.config()
dbContext()


//authorization: Bearer [token]
cron.schedule(' 0 0 * * *', async () => {
    
    try {
        const allEvents = await event.find({})
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
app.use('/mentor', auth, mentorRouter)

app.use('/admin/login', cors(), async (req,res) => {
    const {email, password} = req.body;
    const exists = await admin.findOne({email: email})
    console.log(exists);
    if(!exists)
    return res.status(400).json({Error: "user doesn't exist"})
    if(exists.password == password)
    {
        const toTokenize = {
            
            id: exists.id,
            access: exists.access
        }
        const token = jwt.sign(toTokenize, process.env.ADMIN_SECRET, {expiresIn: '24h'})
        return res.status(200).json({token: token, user: {
            email: exists.email,
            access: exists.access
        }})
    }
    return res.status(400).json({Error: "unauthorized"})
    
})
app.use('/admin', cors(), adminAuth, adminAccessAuth ,adminRouter)

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

app.get('/verifypasswordrestoration', passwordRestorationAuth, async (req,res) => {

    const {email} = req.data;
    const generated_password = randomBytes(7).toString("hex");
    const hashed_password = generated_password;
    const url = req.url.split("?token")
    
    try {
        const updated = await users.findOneAndUpdate({email: email}, {password: hashed_password}, {returnDocument: 'after'})
        if(updated){

            const emailParams = {origin: url[0], target_email: email, generated_password: generated_password, err: ""}
            const emailSent = await sendEmail(emailParams)
            if(emailSent){
                const html = readFileSync(`${__dirname}/html/passwordReset/index.html`).toString();
                return res.status(200).send(html)
            }
                
            else if(emailParams.err == "EENVELOPE")
                return res.status(400).json({user_error: "invalid email"})

            else if(emailParams.err == "invalid origin")
                return res.status(400).json({user_error: "invalid email sending origin"})
            
        }
        return res.status(500).json({server_error: "couldn't send an email"})
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({server_error: "a problem occured with the server"})
    }

    //const hashed_password = await bcryptjs.hash(generated_password,10);
    
})

app.post('/passwordrestoration', async (req,res) => {
    const {email} = req.body;
    try {
        const user = await users.findOne({email: email})
        if(!user)
            return res.status(400).json({error: "doesn't exist"})
    } catch (error) {
        return res.status(500).json({server_error: "a problem occured with the server"})
    }
    

    const toEmailTokenize = {
        email: email
    }
    const emailToken = jwt.sign(toEmailTokenize,process.env.PASSWORD_RESTORATION_SECRET,{expiresIn: '24h'})
    const resetEndpoint = `http://${process.env.HOST}/verifypasswordrestoration?token=${emailToken}`
    const emailParams = {origin: req.url, target_email: email, resetEndpoint: resetEndpoint, err: ""}

    
    const emailSent = await sendEmail(emailParams)
    if(emailSent)
        return res.status(200).json({accepted: "email sent"})

    else if(emailParams.err == "EENVELOPE")
        return res.status(400).json({user_error: "invalid email"})

    else if(emailParams.err == "invalid origin")
        return res.status(400).json({user_error: "invalid email sending origin"})

    return res.status(500).json({server_error: "couldn't send an email"})
    
})

app.get('/verifyemail', emailAuth ,async (req,res) => {

    const {email, password} = req.data;
    try {

        const created = await users.create({email: email, password: password})
        if(created)
        {
            const html = readFileSync(`${__dirname}/html/emailConfirmed/index.html`).toString();
            return res.status(201).send(html)
        } 
        return res.status(500).json({server_error: "couldn't create"})                      
    } catch (err) {
        return res.status(500).json({server_error: "couldn't create"})
    }
    
    
})

app.post('/register', async (req,res) => {

    const email = req.body.email;
    const password = req.body.password

    const user = await users.findOne({email: email})
    if(user)
        return res.status(400).json({error: "exists"})

    const toEmailTokenize = {
        email: email,
        password: password
    }
    const emailToken = jwt.sign(toEmailTokenize,process.env.EMAIL_CONFIRMATION_SECRET,{expiresIn: '15m'})
    const verification_endpoint = `http://${process.env.HOST}/verifyemail?token=${emailToken}`
    const emailParams = {origin: req.url, target_email: email, verificationEndpoint: verification_endpoint, err: ""}

    
    const emailSent = await sendEmail(emailParams)
    if(emailSent)
        return res.status(200).json({accepted: "email sent"})

    else if(emailParams.err == "EENVELOPE")
        return res.status(400).json({user_error: "invalid email"})

    else if(emailParams.err == "invalid origin")
        return res.status(400).json({user_error: "invalid email sending origin"})

    return res.status(500).json({server_error: "couldn't send an email"})
    

})


app.use((req,res) => {
    return res.status(404).json({Error: "Resource not found"})
})

mongoose.connection.once('open', () => {

    try {
        https.createServer(certifcate, app).listen(process.env.PORT | 443)
        http.createServer(app).listen(process.env.PORT | 80)
    } catch (error) {
        //TODO: CONNECTION ERROR
        console.log(`Error at:\n${error.message}`);
        exit()
    }
    
})

mongoose.connection.on('error', (err) => {
    //TODO: CONNECTION ERROR
    console.log(err);
    exit()
})

