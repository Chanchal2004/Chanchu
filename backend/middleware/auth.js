const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../model/BlackList");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    // ✅ Step 1: Token check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token received in auth middleware:", token);

    // ✅ Step 2: Blacklist check
    const blacklistedToken = await BlackListModel.findOne({ token });
    if (blacklistedToken) {
      return res.status(440).json({ message: "Session expired! Please login again." });
    }

    // ✅ Step 3: JWT verification
    if (!process.env.SECRET_KEY) {
      throw new Error("Missing SECRET_KEY in environment variables");
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT Verification Error:", err.message);
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = auth;
