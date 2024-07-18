const { secretCode } = require("../models/prisma");
const hashService = require("../services/hash-service");
const secretCodeService = require("../services/secret-code-service");
const catchError = require("../utils/catch-error");

exports.createSecretCode = catchError(async (req, res) => {
  const { role } = req.user;
  if (role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const secretCode = hashService.generateSecretCode();
  const createdCode = await secretCodeService.createSecretCode({
    code: secretCode,
  });

  res.status(200).json({ createdCode });
});
