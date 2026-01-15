const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Admin = require("../models/Admin");
const Pdf = require("../models/Pdf");

const router = express.Router();

/* ========= MULTER SETUP ========= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.params.type === "fee") {
      cb(null, "uploads/fee");
    } else if (req.params.type === "notices") {
      cb(null, "uploads/notices");
    } else {
      cb(new Error("Invalid upload type"));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ========= ROUTES ========= */

// ⚠️ TEMPORARY ADMIN CREATE ROUTE (REMOVE AFTER USE)
router.post("/create-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password: hashedPassword
    });

    res.json({ msg: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.json({ status: 0, msg: "Invalid login" });
    }

    const ok = await bcrypt.compare(password, admin.password);
    if (!ok) {
      return res.json({ status: 0, msg: "Invalid login" });
    }

    const token = jwt.sign(
      { role: "admin", id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ status: 1, token });
  } catch (err) {
    res.status(500).json({ status: 0, msg: "Server error" });
  }
});

// UPLOAD PDF
router.post(
  "/upload/:type",
  adminAuth,              // ✅ FIRST auth
  upload.single("pdf"),   // ✅ THEN multer
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ status: 0, msg: "No file uploaded" });
      }

      await Pdf.create({
        title: req.file.originalname,
        filename: req.file.filename,
        type: req.params.type
      });

      res.json({ status: 1, msg: "PDF uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 0, msg: "Upload failed" });
    }
  }
);


module.exports = router;
