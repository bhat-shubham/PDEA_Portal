/* eslint-disable @typescript-eslint/no-require-imports */
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;

  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("[VERIFY TOKEN]", decoded);
    return (req.user = decoded), next();
  } catch (error) {
    console.error("[VERIFY TOKEN ERROR]", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = auth;
