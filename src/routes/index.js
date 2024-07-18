const express = require("express");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");

const router = express.Router();

router.use("/auth", userRoutes);

router.use("/admin", adminRoutes);

module.exports = router;
