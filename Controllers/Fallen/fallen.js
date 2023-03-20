import express from 'express'
import Fallen from '../../Models/fallen.js'
import { documentToObject, __dirname } from '../../utils.js'

const fallenRouter = express.Router()

//TODO: Refactor - TEST REQUIRED
fallenRouter.get('/', async (req,res) => {
    const {id} = req.query
    if(id)
    {
        try 
        {
            const specificFallen = await Fallen.findById(id)
            if(specificFallen)
                return res.status(200).json(documentToObject(specificFallen))
            
            return res.status(400).json({user_error: "doesn't exist"})
                
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
    }
    try {
        const allEntries = await Fallen.find({})
        if(allEntries)
            return res.status(200).json(allEntries.map(o => documentToObject(o)))

        return res.status(500).json({server_error: "couldn't fetch resources"})
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})


export default fallenRouter