const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("productId")
      .populate("userId");

    res.status(200).json({ data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

exports.getReviewsForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await Review.find({ productId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    if (!reviews.length) {
      return res.status(404).json({
        status: "error",
        message: "No reviews found for this product.",
      });
    }

    res.status(200).json({ status: "success", data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.getSellerReviews = async (req, res) => {
  try {
    const { productIds } = req.body;

    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate("userId", "name email")
      .populate("productId", "name");

    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews", error: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { productId } = req.params;
  const { userId, rating, comment } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found" });
    }
    const existingReview = await Review.findOne({ productId, userId });
    if (existingReview) {
      return res.status(400).json({
        status: "error",
        message: "You have already reviewed this product",
      });
    }

    const review = new Review({
      productId,
      userId: userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({
      status: "success",
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    }

    review.rating = rating;
    review.comment = comment;
    await review.save();

    res.status(200).json({
      status: "success",
      message: "Review updated successfully",
      review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  const { reviewId } = req.params;

  try {
    const review = await Review.findById(reviewId);
    if (!review) {
      return res
        .status(404)
        .json({ status: "error", message: "Review not found" });
    }

    await Review.deleteOne({ _id: reviewId });
    res
      .status(200)
      .json({ status: "success", message: "Review deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.getUserReviews = async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await Review.findOne({ userId })
      .populate("userId", "firstName lastName email")
      .sort({ createdAt: -1 });

    if (!reviews) {
      return res
        .status(404)
        .json({ status: "error", message: "No reviews found for this user." });
    }

    res.status(200).json({ status: "success", data: reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
