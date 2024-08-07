const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/validators/authenticate");
const packageController = require("../controllers/packageController");

router.get("/", packageController.getAllPackages);

router.get("/:packageId", authenticate, packageController.checkUserPackage);

module.exports = router;
