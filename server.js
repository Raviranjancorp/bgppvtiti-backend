require("dotenv").config();
const express = require("express");
const studentRoutes = require("./routes/student");
const enquiryRoutes = require("./routes/enquiry");

const cors = require("cors");
const path = require("path");

require("./db");


const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const auth = require("./middleware/authMiddleware");


const app = express(); // ✅ MUST be before app.use

// 🔹 Global middlewares
app.use(cors());
app.use(express.json());

// 🔹 Routes
app.use("/api", authRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Secure PDF download routes
app.get("/api/download/fee", auth, (req, res) => {
  res.download(path.join(__dirname, "uploads/fee/fee-receipt.pdf"));
});

app.get("/api/download/notice1", auth, (req, res) => {
  res.download(path.join(__dirname, "uploads/notices/notice1.pdf"));
});

app.get("/api/download/notice2", auth, (req, res) => {
  res.download(path.join(__dirname, "uploads/notices/notice2.pdf"));
});

app.use("/uploads", express.static("uploads"));

app.use("/api/student", studentRoutes);
//email
app.use("/api/website/enquiry", enquiryRoutes);


// 🔹 Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// TEMPORARY ROUTES 
const sendEmail = require("./utils/sendEmail"); // correct path

app.get("/test-mail", async (req, res) => {
  try {
    await sendEmail({
      name: "Test User",
      email: "test@gmail.com",
      phone: "9999999999",
      message: "This is a test email from Nodemailer"
    });

    res.send("✅ Test email sent. Check inbox / spam.");
  } catch (err) {
    console.log(err);
    res.send("❌ Email failed");
  }
});


// 🔹 Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

