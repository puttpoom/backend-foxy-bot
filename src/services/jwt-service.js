const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "JWT_SECRET";
const EXPIRE_IN = process.env.JWT_EXPIRE_IN || "1h";

exports.sign = (payload) =>
  jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRE_IN });

exports.verifyToken = (token, callback) =>
  jwt.verify(token, SECRET_KEY, callback);
