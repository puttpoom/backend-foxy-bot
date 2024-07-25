const jwt = require("jsonwebtoken");

const catchError = require("../../utils/catch-error");
const jwtService = require("../../services/jwt-service");
const userService = require("../../services/user-service");

const authenticate = catchError(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No Bearer");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token, "token");
  if (token == null) {
    console.log("No token provided");
    return res.status(401).json({ message: "No token provided" });
  }

  jwtService.verifyToken(token, async (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: `${error}` });
    } else {
      const user = await userService.findUserById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      delete user.password;

      req.user = user;

      next();
    }
  });
});

module.exports = authenticate;
