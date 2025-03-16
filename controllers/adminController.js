const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Controller to create a new admin
const createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, profileUrl, password } =
      req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        status: "error",
        message: "Admin with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      firstName,
      lastName,
      phone,
      email,
      profileUrl,
      password: hashedPassword,
    });

    // Save the admin to the database
    await newAdmin.save();
    res.status(201).json({
      status: "success",
      data: newAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error creating admin",
      error,
    });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: admin.id, userType: "admin", email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      data: { adminId: admin.id, firstName: admin.firstName },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

// Controller to get all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({
      status: "success",
      data: admins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching admins",
      error,
    });
  }
};

// Controller to get an admin by id
const getAdminById = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error fetching admin",
      error,
    });
  }
};

// Controller to update an admin by id
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, email, profileUrl } = req.body;

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { firstName, lastName, phone, email, profileUrl },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error updating admin",
      error,
    });
  }
};

// Controller to delete an admin by id
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(id);
    if (!deletedAdmin) {
      return res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Admin deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error deleting admin",
      error,
    });
  }
};

module.exports = {
  createAdmin,
  loginAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
