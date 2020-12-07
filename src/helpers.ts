import { ValidationError } from "class-validator";
import { Request, Response, NextFunction } from "express";

function getValidationErrorConstraints(errors: ValidationError[]){
    return errors.map((el: ValidationError)=> {
        return {
            property: el.property,
            constraints: el.constraints
        };
    });
}

function validateDataObjectInReq(req: Request, res: Response, next: NextFunction){
    if (req.body.data === undefined){
        res.status(400);
        return next({error:new Error("Must provide user data.")});
    }else{
        return next();
    }
}

export {
    getValidationErrorConstraints,
    validateDataObjectInReq
};