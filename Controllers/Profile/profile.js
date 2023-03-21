import  express  from "express";
import users from "../../Models/user.js";
import { documentToObject, __dirname, isBodyValid } from "../../utils.js";
import dotenv from 'dotenv'
import user from "../../Models/user.js";
import mentor_request from "../../Models/mentor_request.js";
const profileRouter = express.Router()
dotenv.config()

profileRouter.get('/',async (req,res) => {

    const id = req.data.id;
    let details;
    try {
        details = await users.findById(id)
        const requests = await mentor_request.find({associateUser: id})
        const output = {user : documentToObject(details, ['password']),
                        mentor_requests: requests.map(x => documentToObject(x, ['associateUser']))}
        if(output)
            return res.status(200).json(output)

        return res.status(400).json({user_error: "doesn't exist"})
    } catch (error) {
        return res.status(500).json({s_error: "an error occured with the server"})
    }
    
    
}) 



profileRouter.put('/',async (req,res) => {

    const id = req.data.id
    const body = req.body
    
    if(body && isBodyValid(user.schema, body))
    {
        
        try 
        {
            const updated = await user.findByIdAndUpdate(id,body,{returnDocument: 'after'})
            if(updated)
                return res.status(200).json(documentToObject(updated, ['password']))

            return res.status(500).json({server_error: "couldn't update resource"})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    return res.status(400).json({user_error: "invalid fields"})
    
})


export default profileRouter