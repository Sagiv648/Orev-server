import express from 'express'
import User from '../../Models/User.js'
import { documentToObject } from '../../utils.js'
const usersRouter = express.Router()

usersRouter.get('/', async (req,res) => {
    const {id} = req.query;
    if(id)
    {
        const specificUserProfile = await User.findOne({id: id, private_profile: false})
        res.status(200).json({Result: specificUserProfile ? documentToObject(specificUserProfile) : []})

    }
    else{
        const fields = Object.keys(req.query).reduce((o,key) => req.query[key].length > 0 ? {...o, [key]: req.query[key]} : o, {})
        const query = {...fields, private_profile: false}
        const usersByQuery = await User.find(query)
        res.status(200).json({Result : usersByQuery.length > 0 ? usersByQuery.map(x => documentToObject(x)) : []})
    }
})

export default usersRouter