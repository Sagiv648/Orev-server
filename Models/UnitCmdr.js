import {Schema, model} from "mongoose";

export default model("UnitCmdr", 
new Schema({
    first_name: String,
    last_name: String,
    active_years: String,
    picture: String
}))