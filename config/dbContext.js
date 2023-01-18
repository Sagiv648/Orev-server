import mongoose from "mongoose";

export default async () =>{ 
    try{
        await mongoose.connect(process.env.MONGO_CONN_STR)
    }
    catch(err) {

    }
    
}