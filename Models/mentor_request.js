import { Schema, model } from "mongoose";

export default model('mentor_request', new Schema({
    associateUser: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    industry:{
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "OPEN"
    }
}))