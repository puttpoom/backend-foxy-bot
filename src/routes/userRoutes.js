const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/validators/authenticate");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authenticate, userController.getMe);

router.get(
  "/line/login",
  userController.lineLogin,
  userController.lineCallback
);
router.get("/line/callback", userController.lineCallback);

router.post("/line/postCallback", userController.linePostCallback);

router.get("/logout", authenticate, userController.logout);

module.exports = router;
