/* eslint-disable @typescript-eslint/no-require-imports */
// routes/auth.js

const jwt = require("jsonwebtoken");

const protectRoute = async (req, res) => {
  try {
    
    const token =
      req.cookies?.token ||
      req.headers["authorization"]?.split(" ")[1] ||
      req.body.token;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.status(200).json({
      message: "authorized",
      user: decoded, // you can send user data
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error });
  }
};

module.exports = protectRoute;
