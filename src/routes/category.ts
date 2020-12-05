import express, {Router} from "express";
import {createCategory, getCategoryList} from "../controllers/category.controller";

const category : Router = express.Router();

category.post("/create", createCategory);
category.get("/list", getCategoryList);

export default category;