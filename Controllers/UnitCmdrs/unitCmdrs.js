import  express  from "express";
import mongoose from "mongoose";
import unitCmdrs from '../../Models/unitcmdr.js'
import { __dirname } from "../../utils.js";
const unitCmdrsRouter = express.Router()


unitCmdrsRouter.get('/', async (req,res) => {
    
    try {
        const allEntries = await unitCmdrs.find({}).select('-__v')
        return res.status(200).json(allEntries)
        
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: "error occured with the server"})
    }

})



export default unitCmdrsRouter