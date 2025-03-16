const Order = require("../models/Order.js");
const Product = require("../models/Product.js"); // Ensure you have a Product model

// Create Order
const createOrder = async (req, res) => {
  try {
    const { customerId, totalPrice, items } = req.body;

    if (!customerId || !items || !items.length) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    let processedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.productId}` });
      }

      // Ensure price is correct
      const price = item.price || product.price;
      processedItems.push({
        productId: product._id,
        sellerId: product.userId, // Assuming sellerId is stored in the Product model
        quantity: item.quantity,
        price: price,
        advertisedPrice: item.advertisedPrice || null,
      });
    }
    console.log(processedItems);
    // Create and save order
    const order = new Order({
      customerId,
      items: processedItems,
      totalPrice,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all orders (populating product details)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product", "name price"); // Populate product details
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "items.product",
      "name price"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const order = await Order.find({ customerId: req.params.id }).populate(
      "items.productId",
      "name price"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Order
const updateOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let totalPrice = 0;

    // Validate products and recalculate total price if items are updated
    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      item.price = item.price || product.price;
      totalPrice += item.price * item.quantity;
    }

    // Update order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { items, totalPrice },
      { new: true, runValidators: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderByUserId,
  updateOrder,
  deleteOrder,
};
