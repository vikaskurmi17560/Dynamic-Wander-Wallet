const Products = require("../models/product");
const { uploadSingleImage } = require("../services/cloudinary");

exports.createProduct = async (req, res) => {
    try {
      const { name, description, price, category, userId } = req.body;
      let imageUrl = "";
 
      if (req.files && req.files.image) {
        const uploadedImage = await uploadSingleImage(req.files.Product_image.path); 
        if (uploadedImage && uploadedImage.secure_url) {
          imageUrl = uploadedImage.secure_url;
        }
      }
  
      const product = await Products.create({
        name,
        description,
        price,
        category,
        image: imageUrl,
        createdBy: userId, 
      });
  
      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error(error);  
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong while creating the product.",
      });
    }
  };
  


  

  exports.getProductsByUser = async (req, res) => {
    try {
      const {userId} = req.query;
  
      const products = await Products.find({ createdBy: userId });
  
      return res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  


  exports.deleteProduct = async (req, res) => {
    try {
     
      const {productId} = req.query;
  
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });
      }
  
     
      const product = await Products.findByIdAndDelete(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
  
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  