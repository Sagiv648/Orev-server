import {Schema, model} from "mongoose";

export default model("user", 
new Schema({
    first_name: {
        type: String,
        default: ""
    },
    last_name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role : {
        type: String,
        default: "User"
    },
    mentor: {
        type: Boolean,
        default: false
    },
    phone_number: {
        type: String,
        default: ""
    },
    recruitment_class: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    occupation: {
        type: String,
        default: ""
    },
    volunteering: {
        type: Boolean,
        default: false
    },
    private_profile: {
        type: Boolean,
        default: false
    },
    linkedin_link: {
        type: String,
        default: ""
    },
    facebook_link: {
        type: String,
        default: ""
    },
    github_link: {
        type: String,
        default: ""
    },
    instagram_link: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: ""
    },
    
}))