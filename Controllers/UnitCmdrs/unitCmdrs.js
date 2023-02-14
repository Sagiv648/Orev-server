import  express  from "express";
import unitCmdrs from './../../Models/UnitCmdr.js'
const unitCmdrsRouter = express.Router()

//TODO: GET all unit cmdrs
unitCmdrsRouter.get('/', async (req,res) => {
    
    const allCmdr = await unitCmdrs.find({})

    if(allCmdr.length == 0)
    return res.status(500).json({error: "Server couldn't retrieve data"})

    const output = allCmdr.reduce((a,o) => ([...a,
         Object.keys(o.toObject()).filter(x => x != '_id' && x != '__v').
         reduce((obj,key) => ({...obj, [key]: o.toObject()[key]}) ,{})]) ,[])

    return res.status(200).json(output)

})


//TODO-ADMIN: POST all unit cmdrs

export default unitCmdrsRouter