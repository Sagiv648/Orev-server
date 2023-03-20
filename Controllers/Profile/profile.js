import  express  from "express";
import users from "../../Models/user.js";
import { documentToObject } from "../../utils.js";
import dotenv from 'dotenv'
import { __dirname } from "../../utils.js";
import user from "../../Models/user.js";
const profileRouter = express.Router()
dotenv.config()

profileRouter.get('/',async (req,res) => {

    const id = req.data.id;
    let details;
    try {
        details = await users.findById(id)
        const output = documentToObject(details)
        if(output)
            return res.status(200).json(output)

        return res.status(400).json({user_error: "doesn't exist"})
    } catch (error) {
        return res.status(500).json({s_error: "an error occured with the server"})
    }
    
    
}) 



//TODO: Refactor - TEST REQUIRED
profileRouter.put('/',async (req,res) => {

    const id = req.data.id
    const body = req.body
    
    if(body)
    {
        const keys = Object.keys(body)
        let i = 0
        const fieldsArr = []
        user.schema.eachPath((pathName, type) => {
            for(i = 0; i < keys.length; i++)
                if(keys[i] == pathName)
                    fieldsArr.push(pathName)
        })

        for(i = 0; i < keys.length; i++)
        {
            let j = 0;
            for(;j < fieldsArr.length; j++)
            {
                if(fieldsArr[j] == keys[i])
                    break;
            }
            if(j == fieldsArr.length)
                break;
        }

        if(i < keys.length)
            return res.status(400).json({user_error: "incorrect fields"})

        try 
        {
            const updated = await user.findByIdAndUpdate(id,body,{returnDocument: 'after'})
            if(updated)
                return res.status(200).json(documentToObject(updated))

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