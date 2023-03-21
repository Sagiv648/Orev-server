import  express  from "express";
import mongoose from "mongoose";
import unitCmdrs from '../../Models/unitcmdr.js'
import { documentToObject,__dirname } from "../../utils.js";
const unitCmdrsRouter = express.Router()


unitCmdrsRouter.get('/', async (req,res) => {
    
    const {id} = req.query
    if(id)
    {
        try 
        {
            if(!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).json({user_error: "invalid id"})
            const specificCmdr = await unitCmdrs.findById()
            if(specificCmdr)
                return res.status(200).json(documentToObject(specificCmdr, []))
            
            return res.status(400).json({user_error: "doesn't exist"})
                
        } 
        catch (error) 
        {
            console.log(error.message);
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    else
    {
        let allCmdr;
        try {
            allCmdr = await unitCmdrs.find({})
        } 
        catch (error) {
            return res.status(500).json({s_error: "an error occured with the server"})
        }

        return res.status(200).json(allCmdr.map((doc) => documentToObject(doc, [])))
    }
    

})



export default unitCmdrsRouter