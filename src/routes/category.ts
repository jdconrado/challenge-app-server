import express, {Router} from "express";
import {createCategory, getCategoryList} from "../controllers/category.controller";
import {validateDataObjectInReq} from "../helpers";

const category : Router = express.Router();

category.post("/create", validateDataObjectInReq, createCategory);
category.get("/list", getCategoryList);

export default category;