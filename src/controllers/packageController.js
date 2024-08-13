const catchError = require("../utils/catch-error");
const packageService = require("../services/package-service");
const subscriptionService = require("../services/subscription-service");

exports.getAllPackages = catchError(async (req, res) => {
  const packages = await packageService.getAllPackages();
  return res.status(200).json(packages);
});

exports.checkUserPackage = catchError(async (req, res) => {
  const userId = req.user.id;
  if (!req.params.packageId || req.params.packageId < 0) {
    return res.status(400).json({ message: `Id is required ${req.params}` });
  }

  const package = await packageService.getPackageByUserIdAndPackageId(
    userId,
    +req.params.packageId
  );

  if (!package) {
    return res
      .status(404)
      .json({ message: "Package not found or User Don't have this package" });
  }

  const currentDate = new Date();

  const isSubcriptionExpired = package.subscriptions.filter((sub) => {
    return new Date(sub.endDate) < currentDate;
  });

  if (isSubcriptionExpired && isSubcriptionExpired.length > 0) {
    for (const sub of isSubcriptionExpired) {
      await subscriptionService.updateExprieSubById(sub.id);
    }
    return res.status(400).json({ message: "Package is expired" });
  }

  return res.status(200).json({ message: "You have This Package" });
});
