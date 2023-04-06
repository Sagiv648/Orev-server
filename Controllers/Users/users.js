import express from 'express'
import User from '../../Models/user.js'
import { documentToObject,__dirname } from '../../utils.js'


const usersRouter = express.Router()

usersRouter.get('/', async(req,res) => {
    
        const {first_name, last_name} = req.query;

        let query = {private_profile: false}
        if(first_name)
            query["first_name"] = {$regex: first_name}
        if(last_name)
            query["last_name"] = {$regex: last_name}

        console.log(req.query);
        try 
        {
            const usersByQuery = await User.find(query)
            .select('-password')
            .select('-__v')
            return res.status(200).json(usersByQuery)
        } 
        catch (error) {
            return res.status(500).json({server_error: "error occured with the server"})
        }
        
})


usersRouter.get('/roles', async (req,res) => {

    try {
        const allRoles = await User.find({role: {$ne: 'User'}}, '-password -__v')
        return res.status(200).json(allRoles)
    } 
    catch (error) {
        res.status(500).json({server_error: "error occured with the server"})
    }

})

export default usersRouter