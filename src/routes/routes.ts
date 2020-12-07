import express, {Router} from "express";
import auth from "./auth";
import products from "./products";
import users from "./users";
import category from "./category";
import {requireProtected} from "../middlewares";

const router : Router = express.Router();

//unprotected routes
router.use("/auth", auth);

//protected routes

router.use("/user", requireProtected,  users);
router.use("/product", requireProtected, products);
router.use("/category", requireProtected, category)

export default router;