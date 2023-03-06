import  express  from "express";
import users from "../../Models/user.js";
import { documentToObject } from "../../utils.js";
import fileUpload from "../../config/filesConfig.js";
const profileRouter = express.Router()

//\TODO: GET profile
profileRouter.get('/',async (req,res) => {

    const id = req.data.id;
    const details = await users.findById(id).exec()
    
    const output = documentToObject(details)

    return res.status(200).json(output)
}) 


profileRouter.post('/upload-avatar', (req,res,next) => {
    console.log(req.body);
    next();
}, fileUpload.single('avatar') )


//
//\TODO: PUT profile (edit profile option)


profileRouter.put('/', fileUpload.single('avatar') ,async (req,res) => {
    const id = req.data.id
    const body = req.body
    
    const toUpdate = {...body, avatar: req.file.path}
    const updated = await users.findOneAndUpdate({_id: id},toUpdate,{returnDocument: "after"})
     if(!updated)
     return res.status(500).json({error: "Server couldn't update"})

     const output = documentToObject(updated)

    return res.status(200).json(output)
})


export default profileRouter