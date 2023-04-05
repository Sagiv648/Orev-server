import express from 'express'
import admin from '../../Models/admin.js'
import env from 'dotenv'
import job from '../../Models/job.js'
import { documentToObject, sendEmail,__dirname, randomBytes, isBodyValid } from '../../utils.js'
import adminActions from '../../config/adminActions.js'
import unitcmdr from '../../Models/unitcmdr.js'
import fallen from '../../Models/fallen.js'
import user from '../../Models/user.js'
import event from '../../Models/event.js'
env.config()
const adminRouter = express.Router()


adminRouter.post('/event', async (req,res) => {
    
    const body = req.body
    if(body && isBodyValid(event.schema, body))
    {
        try {
            const created = await event.create(body)
            if(created)
            {
    
                return res.status(201).json(created)
            }
            else{
                return res.status(500).json({S_Error: "Couldn't create an event"})
            }
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
    
    
})


//TODO: Refactor for id and event_header
adminRouter.delete('/event', async (req,res) => {
    
    //Query strings:
    //Id
    const {id} = req.query
    const {ids} = req.body
    if(id)
    {

        try 
        {
             const deleted = await event.findByIdAndDelete(id,{returnDocument: 'after'})
             return res.status(200).json(deleted)
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured"})
        }
        
    }
    else if(ids)
    {
        try 
        {
            const specifiedDeleted = await event.deleteMany({_id: {$in: ids}}, {returnDocument: 'after'})
            return res.status(200).json(specifiedDeleted)
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured"})
        }


        
    }
    return res.status(400).json({C_Error: "No specification"})
    
})



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
                .select('-password')
                .select('-__v')
                
            if(!updated)
                return res.status(500).json({server_error: "couldn't update"})

            return res.status(200).json(updated)
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
    
    if(email)
    {
        try 
        {
            const isAdmin = await admin.findOne({email: email})
            if(isAdmin)
                return res.status(400).json({user_error: "exists"})
            const userAdmin = await user.findOne({email: email}).select('_id')
            const created = await admin.create({
                email: email,
                associateUser: userAdmin._id,
                access: []
            })
            if(!created)
                return res.status(500).json({server_error: "couldn't create an admin"})
            return res.status(201).json(created)
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    
    }
    return res.status(400).json({user_error: "invalid fields"})
    
})


adminRouter.delete('/admin', async (req,res) => {

    const {id} = req.body;

    try {
        const deleted = await admin.findByIdAndDelete(id,{returnDocument: 'after'}).select('-__v')
        if(!deleted)
            return res.status(400).json({user_error: "admin doesn't exist"})

        return res.status(200).json(deleted)
    } 
    catch (error) {
        return res.status(500).json({server_error: "a problem occured with the server"})
    }

})


adminRouter.post('/job', async (req,res) => {

    const body = req.body;
    if(body && isBodyValid(job.schema, body))
    {
        try {
            
            const created = await job.create(body)
            if(created)
                return res.status(201).json(created)

        } catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        

        return res.status(500).json({server_error: "couldn't create a job"})
    }

    
    return res.status(400).json({user_error: "invalid fields"})
})



adminRouter.delete('/job', async (req,res) => {

    const {id} = req.body
    if(id)
    {
        try 
        {
            const deleted = await job.findByIdAndRemove(id, {returnDocument: 'after'}).select('-__v')
            if(deleted)
                return res.status(200).json(deleted)

        } 
        catch (error) {

            return res.status(500).json({server_error: "error occured with the server"})
        }
        return res.status(400).json({user_error: "job not found"})
    }

    
    return res.status(400).json({user_error: "invalid fields"})
})



adminRouter.post('/unitcmdr', async (req,res) => {

    const body = req.body;
    if(body && isBodyValid(unitcmdr.schema, body))
    {
        try 
        {
            const created = await unitcmdr.create(body)
            if(created)
                return res.status(201).json(created)

            return res.status(500).json({server_error: "couldn't create resource"})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})

})



adminRouter.delete('/unitcmdr', async (req,res) => {
    const {id} = req.query;

    if(id)
    {
        try {
            const deleted = await unitcmdr.findByIdAndDelete(id, {returnDocument: 'after'}).select('-__v')
            if(deleted)
            {
                return res.status(200).json(deleted)
            }
            return res.status(500).json({server_error: "couldn't delete resource"})
        } 
        catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }

    return res.status(400).json({user_error: "invalid fields"})
})



adminRouter.post('/fallen', async(req,res) => {

    const body = req.body;
    if(body && isBodyValid(fallen.schema, body))
    {
        try 
        {
            const created = await fallen.create(body)

            if(created)
            {
                return res.status(201).json(created)
            }
            return res.status(500).json({server_error: "couldn't create resource"})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
    
})



adminRouter.delete('/fallen', async (req,res) => {

    const {id} = req.query;

    if(id)
    {
        try {
            const deleted = await fallen.findByIdAndDelete(id, {returnDocument: 'after'}).select('-__v')
            if(deleted)
            {
                return res.status(200).json(deleted)
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
            .select('-__v')
            .select('-password')
            
            if(updated)
                return res.status(200).json(updated)
            

            return res.status(500).json({server_error: "couldn't update resource"})
            
        } catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
})


export default adminRouter