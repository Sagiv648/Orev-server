import express from 'express'
import mongoose from 'mongoose'
import Event from '../../Models/event.js'
import { documentToObject } from '../../utils.js'
const eventsRouter = express.Router()

eventsRouter.get('/', async (req,res) => {
    //query string:id, date, event_header
    const {id,date, event_header} = req.query

    if(id)
    {
        try 
        {
            if(!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).json({user_error: "invalid id"})

            const specificEvent = await Event.findById(id).select("-__v")
            return res.status(200).json({Result: specificEvent})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        
    }
    else
    {
    
        let query = {}
        if(event_header)
            query["event_header"] = {$regex: event_header}
        if(date)
            query["date"] = {date: date}
        
        try 
        {
            const eventByQuery = await Event.find(query)
                return res.status(200).json({Result: eventByQuery})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        
    }

})

export default eventsRouter