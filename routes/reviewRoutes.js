const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
router.get("/", reviewController.getAllReviews);
router.get(
  "/product/:productId/reviews",
  reviewController.getReviewsForProduct
);
router.post("/seller", reviewController.getSellerReviews);

router.get("/seller/:sellerId", reviewController.getSellerProducts);

router.post("/product/:productId/reviews", reviewController.addReview);

router.put("/review/:reviewId", reviewController.updateReview);

router.delete("/review/:reviewId", reviewController.deleteReview);

router.get("/user/:userId/reviews", reviewController.getUserReviews);

module.exports = router;
