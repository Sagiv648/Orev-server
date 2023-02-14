import  express  from "express";
import users from "../../Models/User.js";
const profileRouter = express.Router()

//TODO: GET profile
profileRouter.get('/',async (req,res) => {

    const id = req.data.id;
    const details = await users.findById(id).exec()
    
    const output = Object.keys(details.toObject()).filter(x => x != 'password' && x != '_id' && x != '__v' )
    .reduce((o,key) => ({...o, [key] : details.toObject()[key]}),{})

    return res.status(200).json(output)
}) 



//TODO: PUT profile (edit profile option)
profileRouter.put('/', async (req,res) => {
    const id = req.data.id
    const body = req.body

    const updated = await users.findOneAndUpdate({_id: id},body,{returnDocument: "after"})
    if(!updated)
    return res.status(500).json({error: "Server couldn't update"})

    const output = Object.keys(updated.toObject()).filter(x => x != 'password' && x != '_id' && x != '__v' )
    .reduce((o,key) => ({...o, [key] : updated.toObject()[key]}),{})

    return res.status(200).json(output)
})


export default profileRouter