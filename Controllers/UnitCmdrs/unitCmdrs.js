import  express  from "express";
import unitCmdrs from '../../Models/unitcmdr.js'
import { documentToObject,readFileSync,__dirname } from "../../utils.js";
const unitCmdrsRouter = express.Router()

//\TODO: GET all unit cmdrs
unitCmdrsRouter.get('/', async (req,res) => {
    
    const allCmdr = await unitCmdrs.find({})

    if(allCmdr.length == 0)
    return res.status(500).json({error: "Server couldn't retrieve data"})

    
    const output = allCmdr.map((doc) => documentToObject(doc))
    
    for(let i = 0; i < output.length; i++)
    {
        if(output[i].picture)
        {
            const pic = readFileSync(`${__dirname}/${output[i].picture}`, 'base64')
            console.log(pic);
            output[i].uri =`data:${output[i].picture_mime};base64,${pic}`
        }
    }
    //console.log(output);
    return res.status(200).json(output)

})



export default unitCmdrsRouter