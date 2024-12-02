import express from "express"
import { login, signup, updateUser, deleteUser, getUser, logout } from "../Controllers/user.controller.js";
import auth from "../MiddleWares/auth.js";

let router = express.Router();

router.post("/signup", signup)
.post("/login", login)
.patch("/update",auth, updateUser)
.delete("/delete",auth, deleteUser)
.get("/",auth,getUser)
.post("/logout",auth, logout)


export default router