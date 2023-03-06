import express from 'express'
import Fallen from '../../Models/fallen.js'
import { documentToObject } from '../../utils.js'

const fallenRouter = express.Router()


fallenRouter.get('/', async (req,res) => {
    const allFallen = await Fallen.find({})

    const output = allFallen.map((doc) => documentToObject(doc))

    return res.status(200).json(output)
})


export default fallenRouter