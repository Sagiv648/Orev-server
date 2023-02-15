import {Schema, model} from "mongoose";

export default model("Users", 
new Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    privilege: {
        privilege_ring: {
            type: Number,
            default: 2
        },
        privilege_id: String,
        privilege_password: String
    },
    phone_number: String,
    recruitment_class: String,
    city: String,
    occupation: String,
    volunteering: String,
    linkedin_link: String,
    facebook_link: String,
    github_link: String,
    instagram_link: String,
    picture: String
}))