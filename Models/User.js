import {Schema, model} from "mongoose";

export default model("Users", 
new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
    recruitment_year: Number,
    recruitment_class: String,
    city: String,
    occupation: {
        industry: String,
        role: String
    },
    volunteering: Boolean,
    linkedin_link: String,
    facebook_link: String,
    github_link: String,
    instagram_link: String,
    picture: String
}))