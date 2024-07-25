const catchError = require("../utils/catch-error");
const packageService = require("../services/package-service");

exports.getAllPackages = catchError(async (req, res) => {
  const packages = await packageService.getAllPackages();
  res.status(200).json(packages);
});
