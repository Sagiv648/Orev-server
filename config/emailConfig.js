import emailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transport = emailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port:465,
    secure: true,
    maxMessages: 100,
    
    secureConnection: false,
    
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_APP_PASSWORD, 
    },
    tls:{
        rejectUnAuthorized:true
    }
    
})
export default transport