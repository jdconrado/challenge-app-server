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
router.use(requireProtected);

router.use("/user", users);
router.use("/product", products);
router.use("/category", category)

export default router;