const express = require('express');
const router = express.Router();
const productController = require('../controllers/product-controller');
const upload = require("../services/multer");

router.post("/create", upload.single("Product_image"), productController.createProduct);
router.get("/get",productController.getProduct);
router.get("/getall",productController.getAllProduct);


module.exports = router;