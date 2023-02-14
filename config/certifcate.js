import fs from 'fs'
import { exit } from 'process';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));


let key;
let cert;
try {
   key = fs.readFileSync(`${__dirname}client-key.pem`)
   cert = fs.readFileSync(`${__dirname}client-cert.pem`)
} catch (err) {
    console.log(err.message);
    exit()
}

 export default {
    key:  key,
    cert: cert
}