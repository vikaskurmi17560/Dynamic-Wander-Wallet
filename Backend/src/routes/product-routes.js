const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const upload = require("../services/multer");

router.post("/create", upload.single("image"), productController.createProduct);
router.get("/getbyuserid",productController.getProductsByUser);
router.delete("/delete",productController.deleteProduct);

module.exports = router;