import express,{Application, Request, Response} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import fs from "fs";
import https from "https";
import bodyParser from 'body-parser';
import { config } from 'dotenv';
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.CLIENT_ID)

var privateKey  = fs.readFileSync('./src/cert/server.key', 'utf8');
var certificate = fs.readFileSync('./src/cert/server.crt', 'utf8');

export default class App {
    credentials:any
    app:Application;
    httpsServer:any

    constructor(){
        this.app = express();
        this.config();
        this.httpsServer = https.createServer(this.credentials, this.app);
        this.middlewares();
        this.routes();
    }

    config = () => {
        this.app.set('port',process.env.PORT || 5000);
        this.credentials = {key: privateKey, cert: certificate};
    }

    middlewares = () => {
        this.app.use(morgan('dev'));
        this.app.use(cors())
        this.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
        this.app.use(bodyParser.json({ limit: '50mb' }));
        this.app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));
    }

    routes = () => {

        this.app.get('/',(req:Request, res:Response) => {
            res.json({'msg':'ok'})
        })

        this.app.post("/api/v1/auth/google", async (req, res) => {
            const { token }  = req.body
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.CLIENT_ID
            });
            console.log(ticket);
            const { name, email, picture } = ticket.getPayload();    
            
           // const user = await db.user.upsert({ 
           //     where: { email: email },
           //     update: { name, picture },
           //     create: { name, email, picture }
           // })
            res.status(201)
            res.json({name})
        })





    }

    listen = () => {
        this.httpsServer.listen(this.app.get('port'),() => {
            console.log(`https server on port ${this.app.get('port')}`)
        });
       
    }

}