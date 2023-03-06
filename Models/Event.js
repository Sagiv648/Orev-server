import {Schema, model} from "mongoose";

export default 
model("Events", 
new Schema({
    event_header: String,
    date: {
        type: String,
        required: true
    },
    location:{
        city: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    time: String,
    description: String,
    email_sending: Boolean
}))

