const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");

// Controller to create a new product
const createProduct = async (req, res) => {
  try {
    const {
      userId,
      categoryId,
      name,
      brand,
      description,
      stock,
      price,
      imgUrl,
    } = req.body;

    // Find user and category to validate existence
    const user = await User.findById(userId);
    const category = await Category.findById(categoryId);

    if (!user || !category) {
      return res.status(404).json({
        status: "error",
        message: "User or Category not found",
      });
    }

    // Create new product
    const newProduct = new Product({
      userId,
      categoryId,
      name,
      brand,
      description,
      stock,
      price,
      imgUrl,
    });

    // Save product to database
    await newProduct.save();
    res.status(201).json({
      status: "success",
      data: newProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Error creating product",
      error,
    });
  }
};

// Controller to get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId")
      .populate("userId");
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching products",
      error,
    });
  }
};

// Controller to get a product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id)
      .populate("categoryId")
      .populate("userId");
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching product",
      error,
    });
  }
};

const getProductByCategoryId = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const product = await Product.find({ categoryId: categoryId })
      .populate("categoryId")
      .populate("userId");
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching product",
      error,
    });
  }
};

const getProductByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const product = await Product.find({ userId: userId })
      .populate("categoryId")
      .populate("userId");
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching product",
      error,
    });
  }
};

// Controller to update a product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    })
      .populate("categoryId")
      .populate("userId");
    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: "error",
      message: "Error updating product",
      error,
    });
  }
};

// Controller to delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error deleting product",
      error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByUserId,
  getProductByCategoryId,
  updateProduct,
  deleteProduct,
};
