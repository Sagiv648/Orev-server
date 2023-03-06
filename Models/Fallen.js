import {Schema, model} from "mongoose";

export default model("Fallen", 
new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    recruitment_class: {
        type: String,
        required: true
    },
    picture: String
}))