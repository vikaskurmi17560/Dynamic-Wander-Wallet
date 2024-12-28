const express=require("express");
const {signup,login, forgetPassword,resetPassword} = require("../controllers/user-controller");
const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/forget",forgetPassword);
router.post("/reset-password",resetPassword);
module.exports=router;