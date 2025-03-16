const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Controller to add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the product to validate its existence
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if the product is already in the cart
    const existingCartItem = await Cart.findOne({ userId, productId });

    if (existingCartItem) {
      // Update the quantity if the product already exists in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
      return res.status(200).json({
        status: "success",
        data: existingCartItem,
      });
    }

    // Create a new cart item
    const newCartItem = new Cart({
      userId,
      productId,
      quantity,
    });

    // Save the cart item
    await newCartItem.save();
    res.status(201).json({
      status: "success",
      data: newCartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Error adding product to cart",
      error,
    });
  }
};

// Controller to get all cart items for a user
const getCartItems = async (req, res) => {
  const { userId } = req.params;
  try {
    const cartItems = await Cart.find({ userId }).populate("productId");
    res.status(200).json({
      status: "success",
      data: cartItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching cart items",
      error,
    });
  }
};

// Controller to update the quantity of a cart item
const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const updatedCartItem = await Cart.findByIdAndUpdate(
      id,
      { quantity },
      { new: true }
    ).populate("productId");
    if (!updatedCartItem) {
      return res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedCartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Error updating cart item",
      error,
    });
  }
};

// Controller to remove a product from the cart
const removeFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCartItem = await Cart.findByIdAndDelete(id);
    if (!deletedCartItem) {
      return res.status(404).json({
        status: "error",
        message: "Cart item not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product removed from cart successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error removing product from cart",
      error,
    });
  }
};

module.exports = {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
};
