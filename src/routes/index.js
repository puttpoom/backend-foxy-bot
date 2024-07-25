const express = require("express");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");
const subRoutes = require("./subRoutes");
const packageRoutes = require("./packageRoutes");
const lineRoutes = require("./lineRoutes");

const router = express.Router();

router.use("/auth", userRoutes);

router.use("/subcription", subRoutes);

router.use("/line", lineRoutes);

router.use("/package", packageRoutes);

router.use("/admin", adminRoutes);

module.exports = router;
