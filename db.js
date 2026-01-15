// const mongoose = require("mongoose");

// mongoose.connect("mongodb://127.0.0.1:27017/newdb")
//   .then(() => console.log("MongoDB Connected"))
//   .catch((err) => console.log("MongoDB Error:", err));
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));


