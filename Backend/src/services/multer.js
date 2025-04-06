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

<<<<<<< HEAD

=======
// File filter to allow only images and videos
>>>>>>> ebd01496a55bd35d9e1fbc45935ab4083e8042e3
const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|mp4|mov|avi|mkv/;
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "video/mp4",
        "video/quicktime", // .mov
        "video/x-msvideo", // .avi
        "video/x-matroska" // .mkv
    ];

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.includes(file.mimetype); 

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png) and videos (mp4, mov, avi, mkv) are allowed"));
    }
};

// Initialize multer
const upload = multer({
    storage: storage,
<<<<<<< HEAD
    limits: { fileSize: 100 * 1024 * 1024 }, // 5MB file size limit
=======
    limits: { fileSize: 100 * 1024 * 1024 }, // You can increase this if videos are large
>>>>>>> ebd01496a55bd35d9e1fbc45935ab4083e8042e3
    fileFilter: fileFilter
});

module.exports = upload;
