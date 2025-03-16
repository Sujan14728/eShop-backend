const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductByUserId,
  getProductByCategoryId,
} = require("../controllers/productController");

// Route to create a new product
router.post("/", createProduct);

// Route to get all products
router.get("/", getAllProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

router.get("/user/:userId", getProductByUserId);
router.get("/category/:categoryId", getProductByCategoryId);

// Route to update a product by ID
router.put("/:id", updateProduct);

// Route to delete a product by ID
router.delete("/:id", deleteProduct);

module.exports = router;
