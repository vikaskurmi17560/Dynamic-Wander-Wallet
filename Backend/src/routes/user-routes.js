const express = require("express");
const router = express.Router();
const upload = require("../services/multer"); // ✅ Ensure correct import
const { signup, login, forgetPassword, resetPassword, updateUser, getUser } = require("../controllers/user-controller");


router.post("/signup", signup);
router.post("/login", login);
router.post("/forget", forgetPassword);
router.post("/reset-password", resetPassword);

// Correct usage of upload.fields
router.post("/update-user", upload.fields([{ name: "profile", maxCount: 1 }, { name: "banner", maxCount: 1 }]), updateUser);

router.get("/get-user", getUser);

module.exports = router;
