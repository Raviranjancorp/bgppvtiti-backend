const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Pdf = require("../models/Pdf");

const router = express.Router();

// ✅ STUDENT LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ email });
  if (!student) {
    return res.json({ status: 0, msg: "Invalid login" });
  }

  const ok = await bcrypt.compare(password, student.password);
  if (!ok) {
    return res.json({ status: 0, msg: "Invalid login" });
  }

  const token = jwt.sign({ role: "student" }, "SECRET_KEY");
  res.json({ status: 1, token });
});

// ✅ FETCH PDFs
router.get("/pdfs", async (req, res) => {
  const pdfs = await Pdf.find();
  res.json(pdfs);
});

module.exports = router;
