import express from 'express'
import Fallen from '../../Models/fallen.js'
import mongoose from 'mongoose'
import { documentToObject, __dirname } from '../../utils.js'

const fallenRouter = express.Router()


fallenRouter.get('/', async (req,res) => {

    try {
        const allEntries = await Fallen.find({}).select('-__v')
        return res.status(200).json(allEntries)
        
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: "error occured with the server"})
    }
})


export default fallenRouter