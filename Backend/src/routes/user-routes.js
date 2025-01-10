const express=require("express");
const {signup,login, forgetPassword,resetPassword, updateUser} = require("../controllers/user-controller");
const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/forget",forgetPassword);
router.post("/reset-password",resetPassword);
router.post("/update-user",updateUser);
module.exports=router;