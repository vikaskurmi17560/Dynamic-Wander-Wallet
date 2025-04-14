const fs = require("fs");
const path = require("path");

const vouchersPath = path.join(__dirname, "../data/vouchers.json");

exports.getAllVouchers = (req, res) => {
    try {
        const rawData = fs.readFileSync(vouchersPath, "utf-8");
        const vouchers = JSON.parse(rawData);
        res.status(200).json(vouchers);
    } catch (err) {
        res.status(500).json({ error: "Unable to read voucher data" });
    }
};
