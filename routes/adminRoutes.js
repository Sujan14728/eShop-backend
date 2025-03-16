const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
} = require("../controllers/adminController");

// Route to create a new admin
router.post("/", createAdmin);

router.post("/login", loginAdmin);

// Route to get all admins
router.get("/", getAdmins);

// Route to get an admin by ID
router.get("/:id", getAdminById);

// Route to update an admin by ID
router.put("/:id", updateAdmin);

// Route to delete an admin by ID
router.delete("/:id", deleteAdmin);

module.exports = router;
