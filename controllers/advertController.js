// controllers/advertController.js
const Advert = require("../models/Advert");
const mongoose = require("mongoose");

// @desc    Get all ads
// @route   GET /api/adverts
const getAds = async (req, res) => {
  try {
    const ads = await Advert.find()
      .populate("productId", "name price")
      .sort("-createdAt");
    res.status(200).json({ status: "success", data: ads });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching ads",
      error: error.message,
    });
  }
};

// @desc    Get single ad by ID
// @route   GET /api/adverts/:adId
const getAdById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.adId)) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ad ID" });
    }

    const ad = await Advert.findById(req.params.adId)
      .populate("productId", "name price")
      .populate("createdBy", "name email");

    if (!ad) {
      return res.status(404).json({ status: "error", message: "Ad not found" });
    }

    res.status(200).json({ status: "success", data: ad });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching ad",
      error: error.message,
    });
  }
};

const getPublicActiveAds = async (req, res) => {
  try {
    const currentDate = new Date();
    const activeAds = await Advert.find({
      status: "active",
      startDate: { $lte: currentDate },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: currentDate } },
      ],
    })
      .populate("productId", "name imgUrl")
      .sort("-createdAt")
      .lean();

    res.status(200).json({ status: "success", data: activeAds });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ads", error: error.message });
  }
};

const getActiveAdByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const currentDate = new Date();

    const activeAd = await Advert.findOne({
      productId: productId,
      status: "active",
      startDate: { $lte: currentDate },
      $or: [
        { endDate: { $exists: false } },
        { endDate: { $gte: currentDate } },
      ],
    }).sort("-createdAt");

    res.status(200).json({ status: "success", data: activeAd });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching ad", error: error.message });
  }
};

const getPastAds = async (req, res) => {
  try {
    const currentDate = new Date();
    const pastAds = await Advert.find({
      endDate: { $lt: currentDate },
    })
      .populate("productId", "name price")
      .populate("createdBy", "name email")
      .sort("-endDate");

    res.status(200).json({ data: pastAds });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching past ads", error: error.message });
  }
};

// @desc    Create new ad
// @route   POST /api/adverts
const createAd = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const {
      title,
      productId,
      description,
      url,
      image,
      startDate,
      endDate,
      price,
      status,
    } = req.body;

    // Validate required fields
    if (!productId || !price) {
      return res
        .status(400)
        .json({ message: "productId and price are required" });
    }

    const newAd = new Advert({
      productId,
      description,
      url,
      image,
      price,
      title,
      startDate,
      endDate,
      status,
      createdBy: sellerId,
    });

    const savedAd = await newAd.save();
    res.status(201).json(savedAd);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating ad", error: error.message });
  }
};

// @desc    Update ad
// @route   PUT /api/adverts/:adId
const updateAd = async (req, res) => {
  console.log(req.body);
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.adId)) {
      return res.status(400).json({ message: "Invalid ad ID" });
    }

    const ad = await Advert.findById(req.params.adId);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // Update allowed fields
    const updates = {
      description: req.body.description,
      productId: req.body.productId,
      url: req.body.url,
      image: req.body.image,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      price: req.body.price,
    };

    const updatedAd = await Advert.findByIdAndUpdate(req.params.adId, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedAd);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ad", error: error.message });
  }
};

const updateAdStatus = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({ message: "Invalid ad ID" });
    }

    const ad = await Advert.findById(adId);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const updatedAd = await Advert.findByIdAndUpdate(
      adId,
      { status },
      { new: true, runValidators: true }
    );

    console.log(updatedAd);

    res.status(200).json(updatedAd);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating ad status", error: error.message });
  }
};

const deleteAd = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.adId)) {
      return res.status(400).json({ message: "Invalid ad ID" });
    }

    const ad = await Advert.findByIdAndDelete(req.params.adId);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting ad", error: error.message });
  }
};

const getAdsByUser = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const ads = await Advert.find({ createdBy: req.params.userId })
      .populate("productId")
      .sort("-createdAt");

    res.status(200).json({ data: ads });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user ads", error: error.message });
  }
};

const getActiveAds = async (req, res) => {
  try {
    const currentDate = new Date();

    const activeAds = await Advert.find({
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: currentDate } },
      ],
    })
      .populate("productId", "name price")
      .sort("-createdAt");

    res.status(200).json(activeAds);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching active ads", error: error.message });
  }
};

module.exports = {
  getAds,
  getPublicActiveAds,
  getActiveAdByProductId,
  getPastAds,
  getAdById,
  createAd,
  updateAd,
  updateAdStatus,
  deleteAd,
  getAdsByUser,
  getActiveAds,
};
