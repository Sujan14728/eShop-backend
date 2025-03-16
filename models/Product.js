const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    brand: String,
    description: String,
    stock: Number,
    price: Number,
    imgUrl: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
