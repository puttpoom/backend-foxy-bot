const userService = require("../services/user-service");
const subcriptionService = require("../services/subscription-service");
const catchError = require("../utils/catch-error");

exports.getUserSubcription = catchError(async (req, res) => {
  const userSubcription = await userService.getUserSubcriptionByUserId(
    req.user.id
  );
  res.status(200).json(userSubcription);
});

exports.userBuySubcription = catchError(async (req, res) => {
  const { point } = await userService.getUserPointByUserId(req.user.id);

  const package = await subcriptionService.findPackageById(req.body.packageId);
  if (!package) {
    return res.status(404).json({ message: "Package not found" });
  }

  const packagePrice = package.price;

  if (packagePrice === 0 || point < packagePrice) {
    return res.status(400).json({ message: "Not enough point" });
  } else {
    console.log("userPoint", point);
    console.log("packagePrice", packagePrice);
    await userService.updateUserPointByUserId(
      req.user.id,
      point - packagePrice
    );
  }

  const durationDays = package.duration;
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + durationDays);

  const userSubcription = await subcriptionService.createSubcriptionByUser(
    req.user.id,
    req.body.packageId,
    (req.body.endDate = endDate)
  );
  res.status(200).json(userSubcription);
});

exports.getUserSubcription = catchError(async (req, res) => {
  const userSubcription = await subcriptionService.getUserSubcriptionByUserId(
    req.user.id
  );
  if (!userSubcription) {
    return res.status(404).json({ message: "User has no subscription" });
  }
  return res.status(200).json(userSubcription);
});
