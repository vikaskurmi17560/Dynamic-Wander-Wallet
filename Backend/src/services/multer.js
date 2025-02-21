const multer = require("multer");
const path = require("path");

// Configure storage settings
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads"); // Ensure this folder exists
    },
    filename: function (req, file, cb) {
        const uniqueString = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueString + "-" + file.originalname);
    },
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png) are allowed"));
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: fileFilter
});

module.exports = upload; // ✅ Ensure correct export
