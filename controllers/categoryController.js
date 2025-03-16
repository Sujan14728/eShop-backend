const Category = require("../models/Category");

// Controller to create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({
        status: "error",
        message: "Category already exists",
      });
    }

    // Create new category
    const newCategory = new Category({
      name,
    });

    // Save the category
    await newCategory.save();
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error creating category",
      error,
    });
  }
};

// Controller to get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching categories",
      error,
    });
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categories = await Category.findById(id);
    res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching categories",
      error,
    });
  }
};

// Controller to update a category by id
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating category",
      error,
    });
  }
};

// Controller to delete a category by id
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error deleting category",
      error,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
