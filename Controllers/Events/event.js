import express from 'express'
import Event from '../../Models/event.js'
import { documentToObject } from '../../utils.js'
const eventsRouter = express.Router()

eventsRouter.get('/', async (req,res) => {
    //query string:id, date, event_header
    const {id} = req.query

    if(id)
    {
        const specificEvent = await Event.findById(id)
        res.status(200).json({Result: specificEvent ? documentToObject(specificEvent) : []})
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


        const eventByQuery = await Event.find(query)
        res.status(200).json({Result : eventByQuery.length > 0 ? eventByQuery.map(x => documentToObject(x)) : []})
    }

})

export default eventsRouter