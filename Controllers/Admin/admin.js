import express from 'express'
import User from '../../Models/User.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import ms from 'ms'
import Event from './../../Models/Event.js'
import { privilegeRingOneAuth,privilegeRingZeroAuth } from './adminAuth.js'
import { documentToObject } from '../../utils.js'
env.config()
const adminRouter = express.Router()





adminRouter.post('/login', async (req,res) => {

    console.log("admin login");
    const data = req.data
    const user = await User.findById(data.id)
    
    if(!user)
    return res.status(403).json({Error: "Access denied"})
    
    const body = req.body
    if(body.privilege_id == user.privilege.privilege_id && body.privilege_password == user.privilege.privilege_password){
        const toTokenize = {
            
            id: user.id,
            privilege: {
                privilege_ring: user.privilege.privilege_ring,
                privilege_id: user.privilege.privilege_id
            },
            privileged_token: true
        }
        const token = jwt.sign(toTokenize, process.env.ADMIN_SECRET, {expiresIn: ms('5h')})
        res.status(200).json({privileged_token: token})
    }
    else
        res.status(403).json({Error: "Access denied"})
})

//\TODO: Create an event
adminRouter.post('/addevent', privilegeRingOneAuth, async (req,res) => {

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
adminRouter.delete('/removeevents', privilegeRingOneAuth, async (req,res) => {
    
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



//TODO: Handle addjob route
adminRouter.post('/addjob', privilegeRingOneAuth, (req,res) => {

    console.log("addjob");
    return res.status(201).json({privilege: "addjob route"})
})


//TODO: Handle removejobs route
adminRouter.delete('/removejobs', privilegeRingOneAuth, (req,res) => {

    console.log("removejob");
    return res.status(200).json({privilege: "removejob"})
})


//TODO: Handle updatepriv route
adminRouter.put('/updatepriv', privilegeRingZeroAuth, (req,res) => {

    console.log("updatepriv");
    return res.status(200).json({privilege: "updatepriv route"})
})


//TODO: Handle addunitcmdr route
adminRouter.post('/addunitcmdr', privilegeRingZeroAuth, (req,res) => {

    console.log("addunitcmdr");
    return res.status(201).json({privilege: "addunitcmdr route"})
})


//TODO: Handle removeunitcmdr route
adminRouter.delete('/removeunitcmdr', privilegeRingZeroAuth, (req,res) => {

    console.log("removeunitcmdr");
    return res.status(200).json({privilege: "removeunitcmdr route"})
})


//TODO: Handle addfallen route
adminRouter.post('/addfallen', privilegeRingZeroAuth, (req,res) => {

    console.log("addfallen");
    return res.status(201).json({privilege: "addfallen route"})
})


//TODO: Handle removefallen route
adminRouter.delete('/removefallen', privilegeRingZeroAuth, (req,res) => {

    console.log("removefallen");
    return res.status(200).json({privilege: "removefallen route"})
})


export default adminRouter