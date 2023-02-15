import express from 'express'
import User from '../../Models/User.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import ms from 'ms'
import { privilegeRingOneAuth,privilegeRingZeroAuth } from './adminAuth.js'
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


//TODO: Create an event
adminRouter.post('/addevent', privilegeRingOneAuth, (req,res) => {

    
    console.log("addevent");
    return res.status(201).json({privilege: "addevent route"})
})


//TODO: Delete event
adminRouter.delete('/removeevent', privilegeRingOneAuth, (req,res) => {

    console.log("removeevent");
    return res.status(200).json({privilege: "removeevent route"})
})


//TODO: Create a job
adminRouter.post('/addjob', privilegeRingOneAuth, (req,res) => {

    console.log("addjob");
    return res.status(201).json({privilege: "addjob route"})
})


//TODO: Delete a job
adminRouter.delete('/removejob', privilegeRingOneAuth, (req,res) => {

    console.log("removejob");
    return res.status(200).json({privilege: "removejob"})
})


//TODO: Update user with privilege
adminRouter.put('/updatepriv', privilegeRingZeroAuth, (req,res) => {

    console.log("updatepriv");
    return res.status(200).json({privilege: "updatepriv route"})
})


//TODO: Create unit cmdr
adminRouter.post('/addunitcmdr', privilegeRingZeroAuth, (req,res) => {

    console.log("addunitcmdr");
    return res.status(201).json({privilege: "addunitcmdr route"})
})


//TODO: Delete unit cmdr
adminRouter.post('/removeunitcmdr', privilegeRingZeroAuth, (req,res) => {

    console.log("removeunitcmdr");
    return res.status(200).json({privilege: "removeunitcmdr route"})
})


//TODO: Create fallen
adminRouter.post('/addfallen', privilegeRingZeroAuth, (req,res) => {

    console.log("addfallen");
    return res.status(201).json({privilege: "addfallen route"})
})


//TODO: Delete fallen
adminRouter.delete('/removefallen', privilegeRingZeroAuth, (req,res) => {

    console.log("removefallen");
    return res.status(200).json({privilege: "removefallen route"})
})


export default adminRouter