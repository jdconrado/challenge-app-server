import {Request, Response, NextFunction} from "express";
import { getConnection } from "typeorm";
import {validate} from "class-validator";
import Product, {Filters} from "../entities/Product";
import Category from "../entities/Category";
import User from "../entities/User";

import {getValidationErrorConstraints as getErrors} from "../helpers";

interface productInterface{
    title?: string
    category?: {
        id: number
    }
    price?:  number
    stock?: number
}

async function createProduct(req: Request, res: Response, next: NextFunction) {
    let data: productInterface =  req.body.data;
    if (data.category!== undefined){
        const category = await Category.findOne({id: data.category.id});
        const user  = await User.findOne({id: req.user.id});
        if (category !== undefined && user !== undefined){
            const product: Product = new Product();
            product.title = data.title || "";
            product.price = data.price || 0;
            product.stock = data.stock || 0;
            product.user = user;
            product.category =  category;

            const errorList = await validate(product);
            if(errorList.length > 0){
                res.status(422);
                return next({error: new Error("Data has not passed the validations."), errorList: getErrors(errorList)});
            }else{
                try {
                    await product.save();
                    await getConnection().queryResultCache!.remove(["products_*"]);
                    res.status(200);
                    return res.json({
                        data:{
                            product:{
                                id: product.id
                            }
                        }
                    });
                } catch (error) {
                    console.log(error);
                    res.status(500);
                    return next({error: new Error("Internal server Error")});
                }
            }
        }else{
            res.status(422);
            return next({error: new Error("Category not found.")})
        }
    }else{
        res.status(400);
        return next({error:new Error("Must provide category data for the produt.")});
    }
}

async function getProduct(req: Request, res: Response, next: NextFunction) {
    if(req.params.id !== undefined){
        const product = await Product.getOneWithCategory(parseInt(req.params.id));
        if (product !== undefined){
            res.status(200);
            return res.json({
                data:{
                    product: {
                        ...product,
                        userId : req.user.id
                    }
                }
            });
        }else{
            return next();
        }
    }else{
        res.status(422);
        return next({error: new Error("Must provide product id.")});
    }
}

async function updateProduct(req: Request, res: Response, next: NextFunction){
    if(req.params.id !== undefined){
        let data: productInterface =  req.body.data;
        const product = await Product.getOneWithUser(parseInt(req.params.id));
        if(product !== undefined){
            
            if(product.user.id !== req.user.id){
                res.status(401);
                return next({error: new Error("Not authorized to peform this action.")});
            }

            if (data.category !== undefined){
                const category = await Category.findOne({id: data.category.id});
                if (category !== undefined)
                    product.category = category;
            }
            if (data.price !== undefined){
                product.price = data.price;
            }
            if (data.stock !== undefined){
                product.stock = data.stock;
            }
            if (data.title !== undefined){
                product.title = data.title;
            }
            const errorList = await validate(product);
            if(errorList.length > 0){
                res.status(422);
                return next({error: new Error("Data has not passed the validations."), errorList});
            }else{
                try {
                    await product.save();
                    res.status(200);
                    return res.json({
                        data:{
                            product: {
                                id: product.id,
                                title: product.title,
                                price: product.price,
                                stock: product.stock,
                                createdAt: product.createdAt,
                                updatedAt: product.updatedAt
                            }
                        }
                    });
                } catch (error) {
                    console.log(error);
                    res.status(500);
                    return next({error: new Error("Internal server Error")});
                }
            }
        }else{
            return next();
        }
    }else{
        res.status(422);
        return next({error: new Error("Must provide product id.")});
    }
}

async function deleteProduct(req: Request, res: Response, next: NextFunction){
    if(req.params.id !== undefined){
        const product = await Product.getOneWithUser(parseInt(req.params.id));
        if (product !== undefined){

            if(product.user.id !== req.user.id){
                res.status(401);
                return next({error: new Error("Not authorized to peform this action.")});
            }
            try{
                await product.remove();
                return res.status(200).end();
            }catch(error){
                console.log(error);
                res.status(500);
                return next({error: new Error("Internal server Error")});
            }
        }else{
            return next();
        }
    }else{
        res.status(422);
        return next({error: new Error("Must provide product id.")});
    }
}

async function search(req: Request, res: Response, next: NextFunction){
    let data: Filters =  req.body.data;
    if (data.page !== undefined){
        const products = await Product.search(data);
        res.status(200);
        return res.json({
            data:{
                products: products
            }
        });
    }else{
        res.status(422);
        return next({error: new Error("Must provide page number.")});
    }
}

async function getCurrentUserProducts(req: Request, res: Response, next: NextFunction){
    if (req.query.page !== undefined){
        const page = req.query.page.toString();
        const products = await Product.getUserProducts(req.user.id, parseInt(page));
        res.status(200);
        return res.json({
            data: {
                products: products
            }
        });
    }else{
        res.status(422);
        return next({error: new Error("Must provide page number.")});
    }
}

export {
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getCurrentUserProducts,
    search
};