const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getOrderByUserId,
} = require("../controllers/orderController.js");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.get("/user/:id", getOrderByUserId);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
