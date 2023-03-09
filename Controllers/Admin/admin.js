import express from 'express'
import admin from '../../Models/admin.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
import Event from '../../Models/event.js'
import job from '../../Models/job.js'
import { documentToObject, sendEmail,__dirname, randomBytes, fs } from '../../utils.js'
import adminActions from '../../config/adminActions.js'
import files from '../../config/filesConfig.js'
import unitcmdr from '../../Models/unitcmdr.js'
import fallen from '../../Models/fallen.js'
import user from '../../Models/user.js'
env.config()
const adminRouter = express.Router()

//\TODO: Create an event
adminRouter.post('/event', async (req,res) => {

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
adminRouter.delete('/event', async (req,res) => {
    
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
adminRouter.put('/priv', async (req,res) => {

    const {access, email} = req.body;
    if(access && email)
    {
        const privs = []
        
        for(let i = 0; i < adminActions.length; i++)
        {
            for(let j = 0; j < access.length; j++)
                if(access[j] == adminActions[i])
                {
                    privs.push(adminActions[i])
                    break;
                }
        }
        
        try {
            const updated = await admin.findOneAndUpdate({email: email},
                {access: adminActions.length == privs.length ? ['*'] : privs}, {returnDocument: 'after'})
            if(!updated)
                return res.status(500).json({server_error: "couldn't update"})

            return res.status(200).json(documentToObject(updated))
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "a problem occured with the server"})
        }
        
    }
    return res.status(400).json({user_error: "invalid fields"})
    
})


adminRouter.post('/admin', async (req,res) => {

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


adminRouter.delete('/admin', async (req,res) => {

    const {email} = req.body;

    try {
        const deleted = await admin.findOneAndRemove({email: email})
        if(!deleted)
            return res.status(400).json({user_error: "admin doesn't exist"})

        return res.status(200).json(documentToObject(deleted))
    } 
    catch (error) {
        return res.status(500).json({server_error: "a problem occured with the server"})
    }

})

//TODO: addjob - Potentially accept as multi-part/form data
adminRouter.post('/job', async (req,res) => {

    const {job_header, job_content} = req.body;
    if(job_header && job_content)
    {
        try {
            
            const created = await job.create({
                job_header: job_header,
                job_content: job_content
            })
            if(created)
                return res.status(201).json(documentToObject(created))

        } catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        

        return res.status(500).json({server_error: "couldn't create a job"})
    }

    
    return res.status(400).json({user_error: "invalid fields"})
})


//TODO: Handle removejobs route
adminRouter.delete('/job', async (req,res) => {

    const {id} = req.body
    if(id)
    {
        try 
        {
            const deleted = await job.findByIdAndRemove(id)
            if(deleted)
                return res.status(200).json(documentToObject(deleted))

        } 
        catch (error) {

            return res.status(500).json({server_error: "error occured with the server"})
        }
        return res.status(400).json({user_error: "job not found"})
    }

    
    return res.status(400).json({user_error: "invalid fields"})
})


//TODO: addunitcmdr - Potentially accept as multi-part/form data
adminRouter.post('/unitcmdr', files.single('picture') , async (req,res) => {


    const doc = req.created_document

    try {
        const updated = await unitcmdr.findByIdAndUpdate(doc.id, {picture: req.file.path}, {returnDocument: 'after'})
        if(updated)
            return res.status(201).json(documentToObject(updated))
        return res.status(500).json({server_error: "couldn't create resource"})
    } catch (error) {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})


//TODO: Handle removeunitcmdr route
adminRouter.delete('/unitcmdr', async (req,res) => {
    const {id} = req.query;

    if(id)
    {
        try {
            const deleted = await unitcmdr.findByIdAndDelete(id)
            if(deleted)
            {
                fs.unlinkSync(`${__dirname}/${deleted.picture}`)
                return res.status(200).json(documentToObject(deleted))
            }
            return res.status(500).json({server_error: "couldn't delete resource"})
        } 
        catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }

    return res.status(400).json({user_error: "invalid fields"})
})


//TODO: addfallen - Potentially accept as multi-part/form data
adminRouter.post('/fallen', files.single('picture') , async(req,res) => {

    const doc = req.created_document

    try {
        const updated = await fallen.findByIdAndUpdate(doc.id, {picture: req.file.path}, {returnDocument: 'after'})
        if(updated)
            return res.status(201).json(documentToObject(updated))
        return res.status(500).json({server_error: "couldn't create resource"})
    } catch (error) {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})


//TODO: Handle removefallen route
adminRouter.delete('/fallen', async (req,res) => {

    const {id} = req.query;

    if(id)
    {
        try {
            const deleted = await fallen.findByIdAndDelete(id)
            if(deleted)
            {
                fs.unlinkSync(`${__dirname}/${deleted.picture}`)
                return res.status(200).json(documentToObject(deleted))
            }
            return res.status(500).json({server_error: "couldn't delete resource"})
        } 
        catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
})


adminRouter.put('/mentor', async (req,res) => {

    const {email,mentor} = req.body;

    if(email)
    {
        try {
            
            const updated = await user.findOneAndUpdate({email: email}, {mentor: !mentor}, {returnDocument: 'after'})
            
            if(updated)
                return res.status(200).json(documentToObject(updated))
            

            return res.status(500).json({server_error: "couldn't update resource"})
            
        } catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
})


export default adminRouter