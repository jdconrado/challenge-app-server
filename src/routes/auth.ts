import express, {Router} from "express";
import {registerUser, loginUser, logout} from "../controllers/user.controller";

const auth : Router = express.Router();

auth.post("/signup", registerUser);
auth.post("/login", loginUser);
auth.get("/logout", logout);

export default auth;