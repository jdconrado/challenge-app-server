import express, {Router} from "express";
import {getCurrentUser} from "../controllers/user.controller";
import {getCurrentUserProducts} from "../controllers/product.controller";

const users : Router = express.Router();

users.get("/info", getCurrentUser);
users.get("/products", getCurrentUserProducts);

export default users;