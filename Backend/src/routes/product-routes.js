const express = require("express");
const { getAllVouchers } = require("../controllers/voucherController");

const router = express.Router();

router.get("/vouchers", getAllVouchers);

module.exports = router;
