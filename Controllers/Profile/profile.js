import  express  from "express";
import users from "../../Models/user.js";
import { documentToObject, removeEmptyFields } from "../../utils.js";
import fileUpload from "../../config/filesConfig.js";
import dotenv from 'dotenv'
import { readFileSync,__dirname } from "../../utils.js";
const profileRouter = express.Router()
dotenv.config()
//\TODO: GET profile
profileRouter.get('/',async (req,res) => {

    const id = req.data.id;
    let details;
    try {
        details = await users.findById(id)
    } catch (error) {
        return res.status(500).json({s_error: "an error occured with the server"})
    }
    
    
    const output = documentToObject(details)
    
    return res.status(200).json(output)
}) 

//
//\TODO: PUT profile (edit profile option)

//TODO: Complete removeEmptyFields function on utils.js
profileRouter.put('/',async (req,res) => {

    const id = req.data.id
    const body = req.body
    
    const toUpdate = removeEmptyFields(body)
    const updated = await users.findOneAndUpdate({_id: id}, req.file ? {...toUpdate, avatar: req.file.path, avatar_mime: req.file.mimetype} : toUpdate,{returnDocument: "after"})
     if(!updated)
     return res.status(500).json({error: "Server couldn't update"})

     const output = documentToObject(updated)

    return res.status(200).json(output)
})


export default profileRouter