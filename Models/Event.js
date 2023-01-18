import {Schema, model} from "mongoose";

export default model("Events", 
new Schema({
    event_header: String,
    date: Date,
    location:{
        city: String,
        address: String
    },
    time: String
}))