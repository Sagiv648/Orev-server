import {Schema, model} from "mongoose";

export default model("Jobs", 
new Schema({
    job_header: {
        type: String,
        required: true
    },
    job_content: {
        type: String,
        required: true
    }
}))