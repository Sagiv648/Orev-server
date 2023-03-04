import {Schema, model} from "mongoose";

export default 
model("Events", 
new Schema({
    event_header: String,
    date: String,
    location:{
        city: String,
        address: String
    },
    time: String,
    description: String,
    email_sending: Boolean
}))

