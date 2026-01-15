const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Admin access only" });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};
