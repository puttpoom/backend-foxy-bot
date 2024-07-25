const catchError = require("../utils/catch-error");

const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");

const userService = require("../services/user-service");
const secretCodeService = require("../services/secret-code-service");
const subscriptionService = require("../services/subscription-service");

exports.register = catchError(async (req, res, next) => {
  const isCodeValid = await secretCodeService.findSecretCode(req.body.code);
  console.log(isCodeValid, "isCodeValid");

  if (!isCodeValid) {
    return res.status(400).json({ message: "Invalid code" });
  }

  if (isCodeValid.code !== req.body.code) {
    return res.status(400).json({ message: "Invalid code" });
  }

  const existUser = await userService.findUserByEmail(req.body.email);
  if (existUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  req.body.password = await hashService.hash(req.body.password);

  delete req.body.code;
  const newUser = await userService.createUser(req.body);

  const activatedUser = await secretCodeService.activateSecretCode(
    isCodeValid.id,
    newUser.id
  );

  const payload = { id: newUser.id, email: newUser.email };

  const accessToken = jwtService.sign(payload);

  console.log(accessToken, "accessToken");
  delete newUser.password;

  res.status(201).json({ newUser, accessToken });
});

exports.login = catchError(async (req, res) => {
  console.log(req.body, "req.body ----- login");
  const existUser = await userService.findUserByEmail(req.body.email);

  console.log(existUser, "existUser ----- login");

  if (!existUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordMatch = await hashService.compare(
    req.body.password,
    existUser.password
  );

  if (!isPasswordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (existUser.uuid === null || existUser.uuid === "") {
    console.log(existUser, "existUser ----");
    console.log(req.body.uuid, "req.body.uuid ----");
    await userService.updateUserUUID(existUser.id, req.body.uuid);
  } else if (existUser.uuid !== req.body.uuid) {
    return res.status(401).json({
      message:
        "User is already logged in from another device, Pls logout from other device",
    });
  }

  const payload = {
    userId: existUser.id,
    email: existUser.email,
    uuid: existUser.uuid,
  };

  const accessToken = jwtService.sign(payload);
  delete existUser.password;

  res.status(200).json({ user: existUser, accessToken });
});

exports.logout = catchError(async (req, res) => {
  const user = await userService.updateUserUUID(req.user.id, (uuid = null));
  if (user) {
    return res.status(200).json({ message: "User logged out" });
  }
});

exports.getMe = catchError(async (req, res) => {
  console.log(req.user, "req");
  return res.status(200).json({ user: req.user });
});
