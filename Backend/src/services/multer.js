const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        const uniqueString = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueString + "-" + file.originalname);
    },
});



const fileFilter = (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|mp4|mov|avi|mkv/;
    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "video/mp4",
        "video/quicktime", 
        "video/x-msvideo", 
        "video/x-matroska" 
    ];

    const extName = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.includes(file.mimetype); 

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Only images (jpeg, jpg, png) and videos (mp4, mov, avi, mkv) are allowed"));
    }
};


const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, 
    fileFilter: fileFilter
});

module.exports = upload;
