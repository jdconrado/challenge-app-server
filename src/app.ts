/// <reference types="./custom" />
import express, {Request, Response, NextFunction} from "express";
import helment from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import routes from "./routes/routes";
import {verifyUserToken} from "./middlewares";

import "reflect-metadata";
import {createConnection} from "typeorm";

if (process.env.NODE_ENV !== "PRODUCTION"){
    require('dotenv').config({ path: __dirname+'/.env' });
}

const showErrorStack = process.env.NODE_ENV !== "PRODUCTION";
const COOKIE_SECRET = process.env.COOKIE_SECRET || "S3CRET";

const app = express();

app.use(helment());
app.use(morgan('dev'));
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200", "https://challenge.slash.codes", "http://challenge.slash.codes"]
}));
app.use(cookieParser(COOKIE_SECRET));
app.use(verifyUserToken);
app.use(express.json());

app.use(routes);

function notFound (req: Request, res: Response, next: NextFunction) : void {
    res.status(404);
    next({error:  new Error(`El recurso solicitado ${req.path} no ha sido encontrado.`)});
}

function errorHandler (error: {error: Error, errorList?: any} | Error, req: Request, res: Response, next: NextFunction) : void {
    if(error instanceof Error){
        if (res.statusCode === 200)
            res.status(500);
        res.json({
            errorMessage: error.message,
            stack: showErrorStack ? error.stack : ''
        });
    }else{
        res.json({
            errorMessage: error.error.message,
            errors: error.errorList,
            stack: showErrorStack ? error.error.stack : ''
        });
    }
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

async function start() {
    // Retry Logic For docker
    let retry: number = 5;
    let connected: boolean = false;
    while(retry>0 && ! connected){
        createConnection().then( (): void=>{
            app.listen(port, () : void=>{
                console.log(`${new Date().toISOString()} - Service started on port ${port}`);
            });
            connected = false;
        }).catch((error: Error): void=>{
            console.log(`${new Date().toISOString()} - Unable to establish database connection.`);
            if(retry===1){
                throw error;
            }else{
                console.log(`Retrying ---- #${retry}`)
            }
        });
        retry-=1;
        await new Promise(res => setTimeout(res, 5000));
    }
}

start();
