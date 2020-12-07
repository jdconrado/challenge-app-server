import express, {Router} from "express";
import {registerUser, loginUser, logout} from "../controllers/user.controller";
import {validateDataObjectInReq} from "../helpers";

const auth : Router = express.Router();

auth.post("/sign-up", validateDataObjectInReq, registerUser);
auth.post("/login", validateDataObjectInReq, loginUser);
auth.get("/logout", logout);

export default auth;