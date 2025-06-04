const Products = require("../models/product");
const User = require("../models/user");

exports.createProduct = async (req, res) => {
  try {

    const product = await Products.create(req.body);
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


exports.getProduct = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {

    const product = await Products.find();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCashback = async (req, res) => {
  const { userId, cashback } = req.body;

  if (!userId || typeof cashback !== 'number' || cashback < 0) {
    return res.status(400).json({ message: "Invalid input data" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const updatedScratchCardCount = Math.max(user.number_scratch_card - 1, 0);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { cashbackwon: cashback },
        $push: { history_cashback: cashback },
        $set: { number_scratch_card: updatedScratchCardCount }
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Cashback added successfully!",
      cashbackwon: updatedUser.cashbackwon,
      remainingScratchCards: updatedUser.number_scratch_card
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
