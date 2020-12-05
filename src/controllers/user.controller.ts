import {Request, Response, NextFunction} from "express";
import {validate} from "class-validator";
import jwt from "jsonwebtoken";
import User from "../entities/User";

import {getValidationErrorConstraints as getErrors} from "../helpers";

interface userData {
    name?: string
    lastName?:string
    email: string
    password: string
}

const JWT_SECRET = process.env.JWT_SECRET || "S3CRET";
const httpsOnly = process.env.NODE_ENV === "PRODUCTION";

async function registerUser(req: Request, res: Response, next: NextFunction){
    const data: userData = req.body.data;
    if ( data !== undefined){

        const exist = await User.findOne({email: data.email.trim()});
        if (exist !== undefined){
            res.status(422);
            return next({error: new Error("This email is already taken.")});
        }
        const user : User = new User();
        user.name = data.name?.trim() || "";
        user.lastName = data.lastName?.trim() || "";
        user.email = data.email.trim();
        user.password = data.password;
        const errorList = await validate(user);
        if(errorList.length > 0){
            res.status(422);
            return next({error: new Error("Data has not passed the validations."), errorList: getErrors(errorList)});
        }else{
            try{
                const savedUser = await user.save();
                jwt.sign({u_id: savedUser.id},JWT_SECRET,{expiresIn: "4h"}, (error, token)=>{
                    if(!error){
                        res.cookie('ujtk',token, {
                            signed: true,
                            httpOnly: true,
                            maxAge: 4*3600000,
                            secure: httpsOnly
                        });
                    }
                    res.status(200);
                    return res.json({
                        data:{
                            user:{
                                id: savedUser.id,
                                name: savedUser.name
                            }
                        }
                    });
                });
            }catch(error){
                console.log(error);
                return res.status(500).end();
            }
        }
    }else{
        res.status(400);
        return next({error:new Error("Must provide user data.")});
    }
}

function incorrectEmailOrPassword(res: Response, next: NextFunction){
    res.status(422);
    return next({error: new Error("Email and/or password are incorrect.")});
}

async function loginUser(req: Request, res: Response, next: NextFunction){
    const data: userData = req.body.data;
    if(data!== undefined && data.email.trim()!== "" &&data.password !== ""){
        if(data.password.length >= 7){
            const user = await User.findOne({email: data.email.trim()});
            if (user !== undefined){
                const loggedin = await user.comparePassword(data.password);
                if (loggedin){
                    jwt.sign({u_id: user.id},JWT_SECRET,{expiresIn: "4h"}, (error, token)=>{
                        if(!error){
                            res.cookie('ujtk',token, {
                                signed: true,
                                httpOnly: true,
                                maxAge: 4*3600000,
                                secure: httpsOnly
                            });
                        }
                        res.status(200).end();
                    });
                }else{
                    return incorrectEmailOrPassword(res, next);
                }
            }else{
                return incorrectEmailOrPassword(res, next);
            }
        }else{
            return incorrectEmailOrPassword(res, next);
        }
    }else{
        res.status(400);
        return next({error: new Error("Must provide user data.")});
    }
}

async function logout(req: Request, res: Response, next: NextFunction){
    res.clearCookie('ujtk');
    res.status(200).end();
}

async function getCurrentUser(req: Request, res: Response, next: NextFunction){
    const userInfo = await User.getUserInfo(req.user.id);
    if (userInfo !== undefined){
        res.status(200);
        return res.json({
            data:{
                user: userInfo
            }
        });
    }else{
        res.status(401);
        return next({error: new Error("User not found.")})
    }
}


export {
    registerUser,
    loginUser,
    logout,
    getCurrentUser
};