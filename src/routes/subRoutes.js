const express = require("express");
const authenticate = require("../middleware/validators/authenticate");
const subController = require("../controllers/subController");
const router = express.Router();

router.get("/", authenticate, subController.getUserSubcription);
router.post("/buy", authenticate, subController.userBuySubcription);

module.exports = router;
