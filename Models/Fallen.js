import {Schema, model} from "mongoose";

export default model("Fallen", 
new Schema({
    first_name: String,
    last_name: String,
    age: Number,
    recruitment_class: String,
    picture: String
}))