import express from 'express'
import Fallen from '../../Models/fallen.js'
import { documentToObject, __dirname, readFileSync } from '../../utils.js'

const fallenRouter = express.Router()


fallenRouter.get('/', async (req,res) => {
    
    const allFallen = await Fallen.find({})

    if(allFallen.length == 0)
        return res.status(500).json({error: "Server couldn't retrieve data"})
    const output = allFallen.map((doc) => documentToObject(doc))

    for(let i = 0; i < output.length; i++)
    {
        if(output[i].picture)
        {
            const pic = readFileSync(`${__dirname}/${output[i].picture}`, 'base64')
            console.log(pic);
            output[i].uri =`data:${output[i].picture_mime};base64,${pic}`
        }
    }
    //console.log(output);
    
    return res.status(200).json(output)
})


export default fallenRouter