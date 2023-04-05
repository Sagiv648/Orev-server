import {Mongoose, Schema, model} from "mongoose";

export default model("admin", 
new Schema({
    email: {
        type: String,
        required: true
    },
    associateUser: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    access: {
        type: Array,
        default: [],
        required: true
    },

}))