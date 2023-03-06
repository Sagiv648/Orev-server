
import * as url from 'url';
import transport from './config/emailConfig.js';
import fs from 'fs'
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const documentToObject = (doc) => {
    return Object.keys(doc.toObject()).filter(x => x != 'password' && x != '__v' && x != 'privilege' )
    .reduce((o,key) => ({...o, [key] : doc.toObject()[key]}),{})
}


//TODO: Add emails
export const sendEmail = async (params) => {
    

    
    var html = ""
    const subject = "Orev NPO email"
    switch (params.origin) {
        case '/addadmin':
            html = fs.readFileSync(`${__dirname}/html/adminRandomPassword.html`).toString().replace('[$generatedPassPlaceholder$]', params.generated_password)
            
            break;
    
        default:
            break;
    }
    try {
        const res = transport.sendMail({
            from: process.env.EMAIL_SENDER,
            to: params.target_email,
            subject: subject,
            html: html
            })

            if(!res)
            return false
        return true

    } catch (error) {
        return false
    }
    
    

}