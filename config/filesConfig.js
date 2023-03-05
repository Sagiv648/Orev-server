import multer, { diskStorage } from 'multer'
import dotenv from 'dotenv'
dotenv.config();
const filesLimit = 1024 * 1024 * 10;

const mimes = ['jpg', 'jpeg', 'png']
const mapping = new Map()
mapping.set("/profile", (id,cb) => {
    cb(null,process.env.AVATARS_FILES_DEST)
})
mapping.set('/addfallen', (id,cb) => {
    cb(null,process.env.FALLEN_FILES_DEST)
})
mapping.set('/addunitcmdr', (id,cb) => {
    cb(null,process.env.CMDRS_FILES_DEST)
})
mapping.set('/addevent', (id,cb) => {
    cb(null,process.env.EVENTS_FILES_DEST)
})
const storage = diskStorage({
    destination: (req,file, cb) => {
        
        const id = req.data.id;
        if(id && mapping.has(req.baseUrl)){
            mapping.get(req.baseUrl)(id,cb)
        }
    },
    filename: (req,file,cb) => {
        const mime = file.mimetype ? file.mimetype.split('/') : null
        if(mime && mime.length == 2)
            cb(null, `${req.data.id}.${mime[1]}`)
        else
            cb(new Error("invalid mime type"))

    },
    
})

const files = multer({
    storage: storage,
    limits: filesLimit,
    fileFilter: (req,file,cb) => {
        const mime = file.mimetype ? file.mimetype.split('/') : null
        if(mimes.filter(x => mime[1] && x == mime[1]).length == 1){
            cb(null,true)
        }
        else
            cb(null, false)
    }
})

export default files
