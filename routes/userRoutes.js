const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logoutUser,
  changePassword,
} = require("../controllers/userController");

// Route to create a new user
router.post("/", createUser);

// Route to get all users
router.get("/", getAllUsers);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

// Route to get a user by ID
router.get("/:id", getUserById);

// Route to update a user by ID
router.put("/:id", updateUser);

// Route to delete a user by ID
router.delete("/:id", deleteUser);

router.put("/password/:userId", changePassword);

module.exports = router;
