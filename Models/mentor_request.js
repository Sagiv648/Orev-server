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
    message: String,
    status: {
        type: String,
        default: "OPEN"
    },
    contact_info: {
        
        contact_type: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
            required: true
        }
    }
    
}))