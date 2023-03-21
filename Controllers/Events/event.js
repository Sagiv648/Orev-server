import express from 'express'
import mongoose from 'mongoose'
import Event from '../../Models/event.js'
import { documentToObject } from '../../utils.js'
const eventsRouter = express.Router()

eventsRouter.get('/', async (req,res) => {
    //query string:id, date, event_header
    const {id} = req.query

    if(id)
    {
        try 
        {
            if(!mongoose.Types.ObjectId.isValid(id))
                return res.status(400).json({user_error: "invalid id"})

            const specificEvent = await Event.findById(id)
            return res.status(200).json({Result: specificEvent ? documentToObject(specificEvent, ['email_sending']) : []})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        
    }
    else
    {
        const query = Object.keys(req.query).reduce((o,key) => req.query[key].length > 0 ? {...o, [key]: req.query[key]} : o, {})

        const keys =Object.keys(query)
        for(let key in keys)
        {
            if(keys[key] == "event_header")
            {
                query[keys[key]] = {$regex: query[keys[key]]}
                break;
            }
        }

        try 
        {
            const eventByQuery = await Event.find(query)
            return res.status(200).json({Result : eventByQuery.length > 0 ? eventByQuery.map(x => documentToObject(x, ['email_sending'])) : []})
        } 
        catch (error) 
        {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        
    }

})

export default eventsRouter