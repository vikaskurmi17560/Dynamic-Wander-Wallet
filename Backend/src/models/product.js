const mongoose = require("mongoose");

const Product_Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", Product_Schema);
module.exports = Product;
