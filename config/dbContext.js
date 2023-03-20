import mongoose from "mongoose";
import {exit} from 'process'
export default async () =>{ 
    try{
        mongoose.connect(process.env.MONGO_CONN_STR)
    }
    catch(err) {
        //TODO: CONNECTION ERROR
        console.log("ERROR at " + err.message);
        exit()
    }
    
}