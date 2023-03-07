
import * as url from 'url';
import transport from './config/emailConfig.js';
import fs from 'fs'
import crypto from 'crypto'
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const documentToObject = (doc) => {
    return Object.keys(doc.toObject()).filter(x => x != 'password' && x != '__v' && x != 'privilege' )
    .reduce((o,key) => ({...o, [key] : doc.toObject()[key]}),{})
}

export const {readFileSync} = fs
export const { randomBytes} = crypto
//TODO: Add emails
export const sendEmail = async (params) => {
    

    
    var html = ""
    const subject = "Orev NPO email"
    
    switch (params.origin) {
        case '/addadmin':
            html = fs.readFileSync(`${__dirname}/html/adminGenericPassword/index.html`).toString().replace('[$generatedPassPlaceholder$]', params.generated_password)
            
            break;
        case '/register':

            html = fs.readFileSync(`${__dirname}/html/emailConfirmation/index.html`).toString().replace('[$Endpoint-URL-Placehoder$]',params.verificationEndpoint)
            break;

        case '/passwordrestoration':
            html = fs.readFileSync(`${__dirname}/html/passwordRestorationEmail/index.html`).toString().replace('[$passwordRestorationPlacehoder$]', params.resetEndpoint)
            break;
        case '/verifypasswordrestoration':
            html = fs.readFileSync(`${__dirname}/html/passwordResetEmail/index.html`).toString().replace('[$generatedPasswordPlaceholder$]', params.generated_password)
            break;
        default:
            params.err = "invalid origin"
            return false
    }
    try {
        const res = await transport.sendMail({
            from: process.env.EMAIL_SENDER,
            to: params.target_email,
            subject: subject,
            html: html
            })
            
            if(!res)
            return false
        return true

    } catch (error) {
        params.err = error.code
        return false
    }
    
    

}