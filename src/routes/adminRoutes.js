const express = require("express");
const adminController = require("../controllers/adminController");
const authenticate = require("../middleware/validators/authenticate");

const router = express.Router();

router.get(
  "/create-secret-code",
  authenticate,
  adminController.createSecretCode
);

module.exports = router;
