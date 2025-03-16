const express = require("express");
const router = express.Router();
const advertController = require("../controllers/advertController");

// Get all ads
router.get("/", advertController.getAds);

router.get("/public/active", advertController.getPublicActiveAds);
router.get(
  "/active/product/:productId",
  advertController.getActiveAdByProductId
);
router.get("/past", advertController.getPastAds);
// Get ad by ID
router.get("/:adId", advertController.getAdById);

// Create new ad
router.post("/:sellerId", advertController.createAd);

// Update ad by ID
router.put("/:adId", advertController.updateAd);
router.put("/status/:adId", advertController.updateAdStatus);

// Delete ad by ID
router.delete("/:adId", advertController.deleteAd);

// Get all ads by user ID
router.get("/user/:userId/ads", advertController.getAdsByUser);

// Get active ads
router.get("/active", advertController.getActiveAds);

module.exports = router;
