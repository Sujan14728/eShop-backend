const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        sellerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", 
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        advertisedPrice: { type: Number },
      },
    ],
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
