import multer, { diskStorage } from 'multer'
import dotenv from 'dotenv'
import { __dirname, fs,isSubstring,documentToObject } from '../utils.js';
import unitcmdr from '../Models/unitcmdr.js';
import fallen from '../Models/fallen.js';

dotenv.config();
const filesLimit = 1024 * 1024 * 10;


const mimes = ['jpg', 'jpeg', 'png']

const mapping = new Map()
mapping.set("/profile", (req,file,cb, origin,mime) => {

    switch (origin) {
        case "destination":
            cb(null,process.env.AVATARS_FILES_DEST)
            break;

        case "filename":
            
            cb(null, `${req.data.id}.${mime}`)
            break

        default:
            break;
    }

    
})
mapping.set('/fallen', async (req,file,cb, origin,mime) => {

    switch (origin) {
        case "destination":
            cb(null,process.env.FALLEN_FILES_DEST)
            
            break;
        case "filename":
            const {first_name, last_name, age,recruitment_class} = req.body
            
            if(first_name && last_name && age && recruitment_class)
            {
                try {
                    const created = await fallen.create({first_name: first_name, last_name: last_name, age: age, recruitment_class: recruitment_class, picture_mime: `image/${mime}`})
                    cb(null, `${created.id}.${mime}`)
                    req.created_document = created
                } 
                catch (error) {
                    cb(null,null)
                }
            }
            break
            
        default:
            break;
    }

    
})
mapping.set('/unitcmdr', async (req,file,cb, origin,mime) => {

    switch (origin) {
        case "destination":
            cb(null,process.env.CMDRS_FILES_DEST)
            break;
        case "filename":
            const {first_name, last_name, active_years} = req.body
            
            
            if(first_name && last_name && active_years)
            {
                try {
                    const created = await unitcmdr.create({first_name: first_name, last_name: last_name, active_years: active_years, picture_mime: `image/${mime}`})
                    cb(null, `${created.id}.${mime}`)
                    req.created_document = created
                } 
                catch (error) {
    
                    cb(null,null)
                }
            }
            
                        
            break
            
        default:
            break;
    }

    
    
})

const storage = diskStorage({
    destination: (req,file, cb) => {
        const keysArr = [...mapping.keys()].filter(x => isSubstring(req.originalUrl, x))

        if(mapping.has(keysArr[0])){

            mapping.get(keysArr[0])(req,file,cb, "destination",null)
        }
        
    },
    filename: (req,file,cb) => {
        const keysArr = [...mapping.keys()].filter(x => isSubstring(req.originalUrl, x))
        console.log(file.mimetype);
        const mime = file.mimetype ? file.mimetype.split('/') : null
        
        if((mime && (mime.length == 2)) && mapping.has(keysArr[0])){
            
            mapping.get(keysArr[0])(req,file,cb, "filename", mime[1])
            
        }
            
        else
            cb(null,null)
        
           
            
        
            

    },
    
})

const files = multer({
    storage: storage,
    limits: filesLimit,
    fileFilter: (req,file,cb) => {
        console.log(file.mimetype);
        const mime = file.mimetype ? file.mimetype.split('/') : null
        if(mimes.filter(x => mime[1] && x == mime[1]).length == 1){
            cb(null,true)
        }
        else
            cb(null, false)
    }
})

export default files
