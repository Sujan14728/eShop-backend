const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} = require("../controllers/categoryController");

// Route to create a new category
router.post("/", createCategory);

// Route to get all categories
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Route to update a category by ID
router.put("/:id", updateCategory);

// Route to delete a category by ID
router.delete("/:id", deleteCategory);

module.exports = router;
