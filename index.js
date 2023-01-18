import mongoose from "mongoose";
import dotenv from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import dbContext from "./config/dbContext.js";
import User from "./Models/User.js";
import Job from "./Models/Job.js";
import Event from './Models/Event.js'
import UnitCmdr from './Models/UnitCmdr.js'
import Fallen from './Models/Fallen.js'
import cors from 'cors'
const app = express()
dotenv.config()
dbContext()
app.use(cors({origin : (origin, callback) =>
    console.log(origin)
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req,res) => {
   
    // if(req.headers.origin != "me")
    //     return res.status(401).json({error: "access denied"})
    res.status(200).json({msg: 'you access it'})
})


mongoose.connection.once('open', () => {
    app.listen(443, process.env.HOST)
    console.log("server listening");
})

mongoose.connection.on('error', (err) => {
    console.log("ERROR ON DB");
    console.log(err);
})
