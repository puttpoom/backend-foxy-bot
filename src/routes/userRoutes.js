const express = require("express");
const userController = require("../controllers/userController");
const authenticate = require("../middleware/validators/authenticate");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/me", authenticate, userController.getMe);

router.get("/logout", authenticate, userController.logout);

module.exports = router;
