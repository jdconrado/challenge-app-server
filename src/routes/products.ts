import express, {Router} from "express";
import {createProduct, getProduct, updateProduct, deleteProduct, search} from "../controllers/product.controller";

const products : Router = express.Router();

products.post("/create", createProduct);
products.get("/get-one/:id", getProduct);
products.patch("/update/:id", updateProduct);
products.delete("/delete/:id", deleteProduct);
products.post("/search", search);

export default products;