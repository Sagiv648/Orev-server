import { Server } from "socket.io";
import http from 'http'
import https from 'https'
import mongoose from "mongoose";
import express from 'express'
import dotenv from 'dotenv'
import dbContext from "./dbContext.js";
import { exit } from "process";
import certifcate from "./certifcate.js";
import mentor_request from "../Models/mentor_request.js";
import jwt from 'jsonwebtoken'

const app = express()
dotenv.config()
dbContext()



mongoose.connection.once('open', () => {

    try {

        const httpsServer = https.createServer(certifcate, app).listen(process.env.PORT | 443)
        const httpServer = http.createServer(app).listen(process.env.PORT | 80)

        //SOCKET.IO-Real time socket.IO functionality
        const io = new Server(httpServer,{transports: ["websocket"]} )
        io.on("connection", (socket) => {
            console.log(socket.id);
            
            
            socket.on("token", (id) => {
                
                 jwt.verify(id, process.env.SECRET, (err, payload) => {
                    if(payload)
                    {

                        const user = payload;
                        console.log(user);
                        mentor_request.on("updated", (details) => {

                            console.log(details);

                            if(details.associateUser._id == user.id){
                                console.log("it's equal, so we send");
                                socket.emit("requests updated", JSON.stringify(details))
                            }
                                
                        })
                    }
                 })
                
            })
            socket.emit("ready", 1)


            
            
            
            //socket.disconnect()
        })
    } catch (error) {
        //TODO: CONNECTION ERROR
        console.log(`Error at:\n${error.message}`);
        exit()
    }
    
})

mongoose.connection.on('error', (err) => {
    //TODO: CONNECTION ERROR
    console.log(err);
    exit()
})

export default app