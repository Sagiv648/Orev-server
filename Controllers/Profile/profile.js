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
    const details = await users.findById(id)
    
    const output = documentToObject(details)
    const avatar = `data:image/jpeg;base64,` + readFileSync(`${__dirname}/${details.avatar}`).toString('base64')
    
    output.avatar = avatar
    return res.status(200).json(output)
}) 


profileRouter.post('/upload-avatar', (req,res,next) => {
    console.log(req.body);
    next();
}, fileUpload.single('avatar') )


//
//\TODO: PUT profile (edit profile option)

//TODO: Complete removeEmptyFields function on utils.js
profileRouter.put('/', fileUpload.single('avatar') ,async (req,res) => {

    const id = req.data.id
    const body = req.body
    
    const toUpdate = removeEmptyFields(body)
    const updated = await users.findOneAndUpdate({_id: id}, req.file ? {...toUpdate, avatar: req.file.path} : toUpdate,{returnDocument: "after"})
     if(!updated)
     return res.status(500).json({error: "Server couldn't update"})

     const output = documentToObject(updated)

    return res.status(200).json(output)
})


export default profileRouter