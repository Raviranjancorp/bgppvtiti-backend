const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const Admin = require("../models/Admin");
const Pdf = require("../models/Pdf");

const router = express.Router();

/* ========= MULTER SETUP (MUST BE FIRST) ========= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.params.type === "fee") {
  cb(null, "uploads/fee");
} 
if (req.params.type === "notices") {
  cb(null, "uploads/notices");
}

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

/* ========= ROUTES ========= */

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) return res.json({ status: 0, msg: "Invalid login" });

  const ok = await bcrypt.compare(password, admin.password);
  if (!ok) return res.json({ status: 0, msg: "Invalid login" });

  const token = jwt.sign({ role: "admin" }, "SECRET_KEY");
  res.json({ status: 1, token });
});

// UPLOAD PDF
router.post("/upload/:type", upload.single("pdf"), async (req, res) => {
  await Pdf.create({
    title: req.file.originalname,
    filename: req.file.filename,
    type: req.params.type
  });

  res.json({ status: 1, msg: "PDF uploaded successfully" });
});

module.exports = router;
