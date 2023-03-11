import {Schema, model} from "mongoose";

export default model("UnitCmdr", 
new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    active_years: String,
    picture: String,
    picture_mime: String
}))