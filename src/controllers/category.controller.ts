import {Request, Response, NextFunction} from "express";
import {validate} from "class-validator";
import Category from "../entities/Category";

import {getValidationErrorConstraints as getErrors} from "../helpers";

interface categoryInterface{
    name: string
}

async function createCategory(req: Request, res: Response, next: NextFunction) {
    const data : categoryInterface = req.body.data;
    if ( data !== undefined && data.name !== undefined){

        const exists = await Category.findOne({name: data.name.trim()});
        if (exists !== undefined){
            res.status(422);
            return next({error: new Error("A category with this name already exists.")});
        }
        const category : Category = new Category();
        category.name = data.name.trim();

        const errorList = await validate(category);
        if(errorList.length > 0){
            res.status(422);
            return next({error: new Error("Data has not passed the validations."), errorList: getErrors(errorList)});
        }else{
            try {
                await category.save();
                res.status(200);
                return res.json({
                    data:{
                        category:{
                            id: category.id
                        }
                    }
                });
            } catch (error) {
                console.log(error);
                return res.status(500).end();
            }
        }
    }else{
        res.status(400);
        return next({error:new Error("Must provide category data.")});
    }
}

async function getCategoryList(req: Request, res: Response, next: NextFunction) {
    const categories = await Category.listAll();
    res.status(200);
    return res.json({
        data:{
            categories:categories
        }
    });
}

export {
    createCategory,
    getCategoryList
};