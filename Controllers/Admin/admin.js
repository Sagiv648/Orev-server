import express from 'express'
import admin from '../../Models/admin.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import Event from '../../Models/event.js'
import { documentToObject, sendEmail,__dirname } from '../../utils.js'

import { adminAuth } from '../Auth/auth.js'
import {randomBytes} from 'crypto'

env.config()
const adminRouter = express.Router()

//TODO: new admin login
adminRouter.post('/login', async (req,res) => {
    
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

//\TODO: Create an event
adminRouter.post('/addevent', adminAuth, async (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'event').length == 0)
    return res.status(401).json({user_error: "unauthorized"})


    const body = req.body
    
    const exists = await Event.findOne({event_header: body.event_header})
    if(exists){
        res.status(400).json({C_Error: "Name taken"})
    }
    else{
        const created = await Event.create(body)
        if(created){

            
            
            res.status(201).json(documentToObject(created))
        }
        else{
            res.status(500).json({S_Error: "Couldn't create an event"})
        }
    }
    
})


//\TODO: Delete event
adminRouter.delete('/removeevents', adminAuth, async (req,res) => {
    
    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'event').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    //Query strings:
    //Id,Header
    const query = req.query
    const defined = Object.keys(query).reduce((o,key) => query[key].length > 0 ? {...o, [key]: query[key]} : o,{})
    
    if(defined){    
        const deleted = await Event.find(defined)
        if(deleted.length >= 1){
            deleted.map(x => x.delete())
            res.status(200).json({Deleted: deleted.map(x => documentToObject(x))})
        }
        else{
            res.status(400).json({C_Error: "Not found"})
        }
    }
    else{
        return res.status(400).json({C_Error: "No specification"})
    }
    
    
})


//TODO: Handle updatepriv route
adminRouter.put('/updatepriv', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'priv').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    

    console.log("updatepriv");
    return res.status(200).json({privilege: "updatepriv route"})
})


adminRouter.post('/addadmin', adminAuth, async (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'admin').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    const {email} = req.body;
    
    const randomPass = randomBytes(7).toString('hex')
    const isAdmin = await admin.findOne({email: email})
    if(isAdmin)
    return res.status(400).json({user_error: "exists"})

    const created = await admin.create({
        email: email,
        password: randomPass,
        access: []
    })
    if(!created)
    return res.status(500).json({server_error: "couldn't create an admin"})
    const emailParams = {origin: req.url, target_email: email ,generated_password: randomPass, err: ""}
    const sent = await sendEmail(emailParams)
    if(sent)
        return res.status(200).json({privilege: "addadmin route"})
    
    else if(emailParams.err == "EENVELOPE")
        return res.status(400).json({user_error: "invalid email"})

    else if(emailParams.err == "invalid origin")
        return res.status(400).json({user_error: "invalid email sending origin"})    
        
    return res.status(500).json({server_error: "couldn't send an email"})
})


adminRouter.delete('/removeadmin', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'admin').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    

    console.log("removeadmin");
    return res.status(200).json({privilege: "removeadmin route"})
})

//TODO: Handle addjob route
adminRouter.post('/addjob', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'job').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    console.log("addjob");
    return res.status(201).json({privilege: "addjob route"})
})


//TODO: Handle removejobs route
adminRouter.delete('/removejob', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'job').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    console.log("removejob");
    return res.status(200).json({privilege: "removejob"})
})


//TODO: Handle addunitcmdr route
adminRouter.post('/addunitcmdr', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'unitcmdr').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    console.log("addunitcmdr");
    return res.status(201).json({privilege: "addunitcmdr route"})
})


//TODO: Handle removeunitcmdr route
adminRouter.delete('/removeunitcmdr', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'unitcmdr').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    console.log("removeunitcmdr");
    return res.status(200).json({privilege: "removeunitcmdr route"})
})


//TODO: Handle addfallen route
adminRouter.post('/addfallen', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'fallen').length == 0)
    return res.status(401).json({user_error: "unauthorized"})

    console.log("addfallen");
    return res.status(201).json({privilege: "addfallen route"})
})


//TODO: Handle removefallen route
adminRouter.delete('/removefallen', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'fallen').length == 0)
    return res.status(401).json({user_error: "unauthorized"})


    console.log("removefallen");
    return res.status(200).json({privilege: "removefallen route"})
})


adminRouter.post('/addmentor', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'mentor').length == 0)
    return res.status(401).json({user_error: "unauthorized"})


    console.log("addmentor");
    return res.status(200).json({privilege: "addmentor route"})
})


adminRouter.post('/removementor', adminAuth, (req,res) => {

    console.log(req.data);
    if(req.data.access.filter(x => x == '*' || x== 'mentor').length == 0)
    return res.status(401).json({user_error: "unauthorized"})


    console.log("removementor");
    return res.status(200).json({privilege: "removementor route"})
})


export default adminRouter