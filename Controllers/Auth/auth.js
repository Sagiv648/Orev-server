import jwt from 'jsonwebtoken'
import env from 'dotenv'
import admin from '../../Models/admin.js'
import user from '../../Models/user.js'
import { readFileSync,__dirname } from '../../utils.js'
env.config()


export const auth = (req,res,next) => {
    
    if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer"))
        return res.status(400).json({error: "no token"})

    const authHeader = req.headers.authorization
    const splitted = authHeader.split(' ')
    const token = splitted.length == 2 && splitted[0] == 'Bearer' ? splitted[1] : null
    
    if(!token)
        return res.status(401).json({Error: "unauthorized"})
    else
        jwt.verify(token, process.env.SECRET, async (err,payload) => {
            if(err)
            {
                return res.status(403).json({error: "unauthorized"})

            }
            else{
                req.data = payload
                try {
                    const exists = await user.findById(payload.id)
                    if(exists)
                        next()
                    else
                        return res.status(403).json({error: "unauthorized"})
                } 
                catch (error) {
                    return res.status(500).json({server_error: "error occured with the server"})
                }

            }
            
        })
}
export const adminAuth = (req,res,next) => {

    if(!req.headers.authorization.startsWith("Bearer"))
        return res.status(400).json({error: "no token"})


    const authHeader = req.headers.authorization
    const splitted = authHeader.split(' ')
    const token = splitted.length == 2 && splitted[0] == 'Bearer' ? splitted[1] : null
    
    if(!token)
    return res.status(401).json({Error: "no token"})
    else
        jwt.verify(token, process.env.ADMIN_SECRET, async (err,payload) => {
            if(err)
            {
                return res.status(403).json({error: "unauthorized"})

            }
            else{
                req.data = payload
                try {
                    const exists = await admin.findById(payload.id)
                    if(exists)
                        next()
                    else
                        return res.status(403).json({error: "unauthorized"})
                } 
                catch (error) {
                    return res.status(500).json({server_error: "error occured with the server"})
                }

                
            }
            
        })
}

export const adminAccessAuth = (req,res,next) => {
    
    const {access} = req.data
    if(access){
        let i = 0;
        for(; i < access.length; i++)
            if(access[i] == '*' || access[i] == req.url)
                return next()
        return res.status(401).json({access_error: "invalid"}) 
    }
    else
        return res.status(400).json({user_error: "invalid"})
    
}

export const mentorAuth = async (req,res,next) => {
    const {id} = req.data
    try {
        const isMentor = await user.findOne({id: id, mentor: true})
        if(isMentor)
            next()
        else
            return res.status(401).json({user_error: "not a mentor"})
    } 
    catch (error) 
    {
        return res.status(500).json({server_error: 'error occured with the server'})
    }
}

export const emailAuth = (req,res,next) => {

    const {token} = req.query;
    if(!token)
        return res.status(401).json({user_error: "no token"})

    jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET, (err,payload) => {
        
        if(err){
            const html = readFileSync(`${__dirname}/html/invalidEmailToken/index.html`).toString();
                return res.status(400).send(html)
        }
        
        req.data = payload;
        next();
    })
}

export const passwordRestorationAuth = (req,res,next) => {

    const {token} = req.query
    if(!token)
    return res.status(401).json({user_error: "no token"})

    jwt.verify(token, process.env.PASSWORD_RESTORATION_SECRET, (err, payload) => {

        if(err){
            const html = readFileSync(`${__dirname}/html/invalidPasswordRestorationEmail/index.html`).toString();
            return res.status(400).send(html)
        }
        
        req.data = payload;
        next();
    })
}