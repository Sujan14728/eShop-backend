const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const User = require("../models/User");

// Controller to add a product to the wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the product to validate its existence
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await Wishlist.findOne({ userId, productId });

    if (existingWishlistItem) {
      return res.status(400).json({
        status: "error",
        message: "Product is already in the wishlist",
      });
    }

    // Create a new wishlist item
    const newWishlistItem = new Wishlist({
      userId,
      productId,
    });

    // Save the wishlist item
    await newWishlistItem.save();
    res.status(201).json({
      status: "success",
      data: newWishlistItem,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Error adding product to wishlist",
      error,
    });
  }
};

// Controller to get all wishlist items for a user
const getWishlistItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const wishlistItems = await Wishlist.find({ userId }).populate("productId");
    res.status(200).json({
      status: "success",
      data: wishlistItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching wishlist items",
      error,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  const { userId, productId } = req.body;
  try {
    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: userId,
      productId: productId,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        status: "error",
        message: "Product not found in wishlist",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Product removed from wishlist successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error removing product from wishlist",
      error,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
};
