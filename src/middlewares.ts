import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "S3CRET";

function verifyUserToken(req: Request, res: Response, next: NextFunction){
    const token = req.signedCookies.ujtk;
    if (token !== undefined){
        const user :any = jwt.verify(token, JWT_SECRET);
        if (user!== undefined){
            req.user = {id: user.u_id};
        }
    }
    return next();
}

function requireProtected(req: Request, res: Response, next: NextFunction){
    if(req.user === undefined){
        res.status(403);
        return next({error: new Error("Log in required.")});
    }
    return next();
}

export {
    verifyUserToken,
    requireProtected
};