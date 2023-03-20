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
            const specificRequest = await mentor_request.findById(id).
            populate('associateUser', 
            {select: '_id email first_name last_name phone_number recruitment_class city occupation' })
            
            if(specificRequest)
                return res.status(200).json(documentToObject(specificRequest, []))
            
            return res.status(500).json({server_error: "couldn't fetch the resource"})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    try 
    {
        const allRequests = mentor_request.find({}).
        populate('associateUser', 
        {select: '_id email first_name last_name phone_number recruitment_class city occupation' })
        
        
        return res.status(200).json(allRequests ? allRequests.map((o) => documentToObject(o)) : [])

        
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})

mentorRouter.put('/acceptrequest', mentorAuth, async (req,res) => {

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

})


export default mentorRouter