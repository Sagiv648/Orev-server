import {Schema, model} from "mongoose";

export default model("Jobs", 
new Schema({
    job_header: String,
    job_content: String
}))