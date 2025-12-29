const express = require("express");
const Enquiry = require("../models/Enquiry");
const sendEmail = require("../utils/sendEmail");

const router = express.Router();

router.post("/insert", async (req, res) => {
  try {
    console.log("✅ Enquiry API HIT");
    console.log("📦 Body:", req.body);

    const { sName, sEmail, sPhone, sMessage } = req.body;

    if (!sName || !sEmail || !sPhone || !sMessage) {
      return res.json({
        status: false,
        message: "All fields required",
      });
    }

    // 1️⃣ Save to MongoDB
    const enquiry = await Enquiry.create({
      name: sName,
      email: sEmail,
      phone: sPhone,
      message: sMessage,
    });

    console.log("✅ Saved to MongoDB:", enquiry._id);

    // 2️⃣ SEND EMAIL (IMPORTANT: BEFORE res.json)
    console.log("➡️ Calling sendEmail()");
    await sendEmail({
      name: sName,
      email: sEmail,
      phone: sPhone,
      message: sMessage,
    });
    console.log("📩 sendEmail() DONE");

    // 3️⃣ Send response LAST
    res.json({
      status: true,
      message: "Enquiry saved successfully",
    });

  } catch (err) {
    console.error("❌ Enquiry error:", err.message);
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

module.exports = router;
