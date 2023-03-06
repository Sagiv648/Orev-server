import {Schema, model} from "mongoose";

export default model("Users", 
new Schema({
    email: String,
    password: String,
    access: {
        type: Array,
        default: []
    },

}))