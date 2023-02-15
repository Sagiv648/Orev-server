import  express  from "express";
import unitCmdrs from './../../Models/UnitCmdr.js'
import { documentToObject } from "../../utils.js";
const unitCmdrsRouter = express.Router()

//TODO: GET all unit cmdrs
unitCmdrsRouter.get('/', async (req,res) => {
    
    const allCmdr = await unitCmdrs.find({})

    if(allCmdr.length == 0)
    return res.status(500).json({error: "Server couldn't retrieve data"})

    
    const output = allCmdr.map((doc) => documentToObject(doc))

    return res.status(200).json(output)

})


//TODO-ADMIN: POST all unit cmdrs

export default unitCmdrsRouter