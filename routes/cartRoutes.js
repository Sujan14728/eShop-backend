const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCartItems,
  updateCartItem,
  removeFromCart,
} = require("../controllers/cartController");

// Route to add a product to the cart
router.post("/", addToCart);

// Route to get all cart items for a specific user
router.get("/:userId", getCartItems);

// Route to update the quantity of a cart item
router.put("/:id", updateCartItem);

// Route to remove a product from the cart
router.delete("/:id", removeFromCart);

module.exports = router;
