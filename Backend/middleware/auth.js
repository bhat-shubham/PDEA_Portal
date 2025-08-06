const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Teacher } = require("../models/studentSchema");

dotenv.config();

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromHeader =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const tokenFromCookie = req.cookies?.token;

  const token = tokenFromHeader || tokenFromCookie;
 console.log("token",token)
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)
    const teacher = await Teacher.findById(decoded.id || decoded._id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    req.user = teacher;
    console.log(req.user)
    next();
  } catch (error) {
    console.error("[VERIFY TOKEN ERROR]", error.message);
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = auth;
