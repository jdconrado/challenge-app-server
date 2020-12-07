import express, {Router} from "express";
import {createProduct, getProduct, updateProduct, deleteProduct, search} from "../controllers/product.controller";
import {validateDataObjectInReq} from "../helpers";

const products : Router = express.Router();

products.post("/create", validateDataObjectInReq, createProduct);
products.get("/get-one/:id", getProduct);
products.patch("/update/:id", validateDataObjectInReq, updateProduct);
products.delete("/delete/:id", deleteProduct);
products.post("/search", validateDataObjectInReq, search);

export default products;