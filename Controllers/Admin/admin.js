import express from 'express'
import User from '../../Models/user.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import ms from 'ms'
import Event from '../../Models/event.js'
import { documentToObject } from '../../utils.js'
import { __dirname } from '../../utils.js'
import { adminAuth } from '../Auth/auth.js'
env.config()
const adminRouter = express.Router()

//TODO: new admin login
adminRouter.post('/login', async (req,res) => {

    
})

//\TODO: Create an event
adminRouter.post('/addevent', adminAuth, async (req,res) => {

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


    console.log("updatepriv");
    return res.status(200).json({privilege: "updatepriv route"})
})


//TODO: Handle addjob route
adminRouter.post('/addjob', adminAuth, (req,res) => {

    console.log("addjob");
    return res.status(201).json({privilege: "addjob route"})
})


//TODO: Handle removejobs route
adminRouter.delete('/removejobs', adminAuth, (req,res) => {

    console.log("removejob");
    return res.status(200).json({privilege: "removejob"})
})


//TODO: Handle addunitcmdr route
adminRouter.post('/addunitcmdr', adminAuth, (req,res) => {

    console.log("addunitcmdr");
    return res.status(201).json({privilege: "addunitcmdr route"})
})


//TODO: Handle removeunitcmdr route
adminRouter.delete('/removeunitcmdr', adminAuth, (req,res) => {

    console.log("removeunitcmdr");
    return res.status(200).json({privilege: "removeunitcmdr route"})
})


//TODO: Handle addfallen route
adminRouter.post('/addfallen', adminAuth, (req,res) => {

    console.log("addfallen");
    return res.status(201).json({privilege: "addfallen route"})
})


//TODO: Handle removefallen route
adminRouter.delete('/removefallen', adminAuth, (req,res) => {

    console.log("removefallen");
    return res.status(200).json({privilege: "removefallen route"})
})


export default adminRouter