const mongoose = require("mongoose");

const advertSchema = new mongoose.Schema(
  {
    title: String,
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    description: String,
    url: String,
    image: String,
    status: { type: String, default: "inactive" },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Advert", advertSchema);
