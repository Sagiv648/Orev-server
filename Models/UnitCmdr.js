import {Schema, model} from "mongoose";

export default model("unitcmdr", 
new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    active_years: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
}))