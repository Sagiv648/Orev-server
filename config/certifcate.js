
import { exit } from 'process';
import { __dirname, fs } from '../utils.js';


let key;
let cert;
try {
   key = fs.readFileSync(`${__dirname}\\config\\client-key.pem`)
   cert = fs.readFileSync(`${__dirname}\\config\\client-cert.pem`)
} catch (err) {
    console.log(err.message);
    exit()
}

 export default {
    key:  key,
    cert: cert
}