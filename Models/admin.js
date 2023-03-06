import {Schema, model} from "mongoose";

export default model("admin", 
new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    access: {
        type: Array,
        default: [],
        required: true
    },

}))