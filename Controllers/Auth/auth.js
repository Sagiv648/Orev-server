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