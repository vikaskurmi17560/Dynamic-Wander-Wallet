const express = require("express");
const router = express.Router();
const upload = require("../services/multer");
const userController = require("../controllers/user-controller");


router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgot", userController.forgetPassword);
router.post("/resetpassword", userController.resetPassword);
router.post("/update-user", upload.fields([{ name: "profile", maxCount: 1 }, { name: "banner", maxCount: 1 }]), userController.updateUser);
router.get("/get-user", userController.getUser);
router.post("/follow", userController.followUser);
router.post("/unfollow", userController.unfollowUser);
router.get("/getalluser", userController.getAllUser);
router.post("/usebadgepoint", userController.useBadgePoints);
router.get("/check-follow", userController.checkFollowStatus);
module.exports = router;
