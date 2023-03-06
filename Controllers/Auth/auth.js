import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()


export const auth = (req,res,next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token)
    return res.status(401).json({Error: "unauthorized"})
    else
        jwt.verify(token, process.env.SECRET, (err,payload) => {
            if(err)
            {
                return res.status(403).json({error: "unauthorized"})

            }
            else{
                console.log("normal auth - normal payload");
                req.data = payload
                next()
            }
            
        })
}
export const adminAuth = (req,res,next) => {

    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if(!token)
    return res.status(401).json({Error: "no token"})
    else
        jwt.verify(token, process.env.ADMIN_SECRET, (err,payload) => {
            if(err)
            {
                return res.status(403).json({error: "unauthorized"})

            }
            else{
                console.log("admin auth - admin payload");
                req.data = payload
                next()
            }
            
        })
}

export const emailAuth = (req,res,next) => {
    const {token} = req.query;
    if(!token)
    return res.status(401).json({user_error: "no token"})
    jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET, (err,payload) => {
        if(err)
        return res.status(403).json({user_error: "unauthorized"})

        console.log("email auth");
        req.data = payload;
        next();
    })
}