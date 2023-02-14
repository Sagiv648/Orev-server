import {Schema, model} from "mongoose";

export default model("Fallen", 
new Schema({
    first_name: String,
    last_name: String,
    age: String,
    recruitment_class: String,
    picture: String
}))