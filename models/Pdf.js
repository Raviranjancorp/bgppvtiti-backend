const mongoose = require("mongoose");

const pdfSchema = new mongoose.Schema({
  title: String,
  filename: String,
  type: String, // notice / fee
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pdf", pdfSchema);
