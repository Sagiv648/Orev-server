import  express  from "express";
import unitCmdrs from '../../Models/unitcmdr.js'
import { documentToObject,readFileSync,__dirname } from "../../utils.js";
const unitCmdrsRouter = express.Router()

//\TODO: GET all unit cmdrs
unitCmdrsRouter.get('/', async (req,res) => {
    
    let allCmdr;
    try {
        allCmdr = await unitCmdrs.find({})
    } 
    catch (error) {
        return res.status(500).json({s_error: "an error occured with the server"})
    }

    if(allCmdr.length == 0)
    return res.status(500).json({error: "Server couldn't retrieve data"})

    return res.status(200).json(allCmdr.map((doc) => documentToObject(doc)))

})



export default unitCmdrsRouter