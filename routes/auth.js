const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const router = express.Router();

// SIGNUP API
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ status: 0, msg: "All fields are required" });
    }

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ status: 0, msg: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword
    });

    await student.save();

    res.status(201).json({ status: 1, msg: "Signup successful" });

  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error" });
  }
});

// LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: 0, msg: "All fields are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ status: 0, msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ status: 0, msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      status: 1,
      msg: "Login successful",
      token
    });

  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error" });
  }
});

module.exports = router;
