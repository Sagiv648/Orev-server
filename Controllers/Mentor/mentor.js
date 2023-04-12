import express  from "express";
import mentor_request from "../../Models/mentor_request.js";
import { mentorAuth } from "../Auth/auth.js";
import { documentToObject } from "../../utils.js";
import user from "../../Models/user.js";
const mentorRouter = express.Router()


mentorRouter.get('/requests', mentorAuth, async (req,res) => {

    const {id} = req.query
    if(id)
    {
        try 
        {
            const specificRequest = await mentor_request.findById(id)
            .populate('associateUser', '-password -__v' )
            return res.status(200).json(specificRequest)
            
        } 
        catch (error) 
        {
            console.log(error.message);
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    try 
    {
        const allRequests = await mentor_request.find({}).
        populate('associateUser', 
        '-password -__v')
        
        return res.status(200).json(allRequests)

        
    } 
    catch (error) 
    {
        console.log(error.message);
        return res.status(500).json({server_error: "error occured with the server"})
    }
})

mentorRouter.put('/acceptrequest', mentorAuth, async (req,res) => {
    const {id} = req.body

    if(id)
    {
        try 
        {
            const updated = await mentor_request.findByIdAndUpdate(id, {status : "HANDLED"}, {returnDocument: 'after'})
            .populate('associateUser', '-password -__v')
            mentor_request.emit("updated", updated)

            return res.status(200).json(updated)
            
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
})

mentorRouter.get('/industries', async (req,res) => {

    try 
    {

        const allIndustries = await user.find({mentor: true})

        const set = new Set(allIndustries.map(x => x.occupation))

        return res.status(200).json({industries: [...set]})
        
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})

mentorRouter.post('/', async (req,res) => {

    const {industry,message, contact_info} = req.body
    const {id} = req.data

    if(id && industry && contact_info)
    {
        try 
        {
            const created = await mentor_request.create(message ? {associateUser: id, industry: industry, message: message, contact_info: contact_info}
                : {associateUser: id, industry: industry, contact_info: contact_info})

            return res.status(201).json(created)
            
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})

})


export default mentorRouter