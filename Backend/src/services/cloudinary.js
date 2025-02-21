const cloudinary = require('cloudinary').v2;
const env = require('dotenv')
const fs = require("fs");
env.config();
cloudinary.config(
    {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_SECRET,
    }
);
exports.uploadSingleImage = async (path) => {
    if (!path) {
        return null;
    }
    try {
        const response = await cloudinary.uploader.upload(path, { resource_type: "auto" });
        fs.unlinkSync(path);
        return response;
    }
    catch (error) {
        console.log("error image uploading in cloudinary")
        fs.unlinkSync(path);
        console.error(error);
    }

}

exports.uploadMultipleImages = async (paths) => {
    
    console.log("paths are : ",paths);
    if (!paths) {
        return null;
    }

    const uploadedImages = paths.map(async (path) => {
        try {
            const response = await cloudinary.uploader.upload(path, { resource_type: "auto" })
            fs.unlinkSync(path);
            return response;
        }
        catch (error) {
            console.log("error image uploading in cloudinary")
            fs.unlinkSync(path);
            console.error(error);
        }
    });
    const response=await Promise.all(uploadedImages)
    console.log(response);
    return response;

}