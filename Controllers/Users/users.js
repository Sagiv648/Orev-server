import express from 'express'
import User from '../../Models/user.js'
import { documentToObject, readFileSync,__dirname } from '../../utils.js'

const usersRouter = express.Router()

usersRouter.get('/', async(req,res) => {
    const {id} = req.query;
    if(id)
    { 
        const specificUserProfile = await User.findOne({id: id, private_profile: false})
        if(specificUserProfile.avatar){
            const read = `data:${specificUserProfile.avatar_mime};base64,` + readFileSync(`${__dirname}/${specificUserProfile.avatar}`, 'base64')
            return res.status(200).json(specificUserProfile ? {...documentToObject(specificUserProfile), uri: read} : [])
        }
        return res.status(200).json(specificUserProfile ? documentToObject(specificUserProfile) : [])   

    }
    else{
        const fields = Object.keys(req.query).reduce((o,key) => req.query[key].length > 0 ? {...o, [key]: req.query[key]} : o, {})
        const query = {...fields, private_profile: false}

        const keys =Object.keys(query)
        for(let key in keys)
        {
            if(keys[key] == "first_name" || keys[key] == "last_name" || keys[key] == "occupation")
            {
                query[keys[key]] = {$regex: query[keys[key]]}
                
            }
        }

        const usersByQuery = await User.find(query)
        const output = usersByQuery.length > 0 ? usersByQuery.map(x => documentToObject(x)) : []
        for(let i = 0; i < output.length; i++)
        {
            if(output[i].avatar)
            {
                const read = `data:${output[i].avatar_mime};base64,` + readFileSync(`${__dirname}/${output[i].avatar}`, 'base64')
                output[i].uri = read
            }
        }
        res.status(200).json(output)
    }
})

export default usersRouter