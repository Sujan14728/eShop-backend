const express = require("express");
const router = express.Router();
const {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} = require("../controllers/wishlistController");

// Route to add a product to the wishlist
router.post("/", addToWishlist);

// Route to get all wishlist items for a specific user
router.get("/:userId", getWishlistItems);

// Route to remove a product from the wishlist
router.post("/remove", removeFromWishlist);

module.exports = router;
