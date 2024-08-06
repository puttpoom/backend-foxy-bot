const axios = require("axios");
const qs = require("querystring");

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

exports.lineLogin = catchError(async (req, res, next) => {
  const state = "line-login"; // คุณสามารถสร้างค่า state ที่ซับซ้อนได้
  const redirectUri = encodeURIComponent(`${process.env.REDIRECT_URI}`);
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CHANNEL_ID}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;
  res.redirect(lineLoginUrl);
});

exports.lineCallback = catchError(async (req, res) => {
  const { code, state } = req.query;
  const redirectUri = `${process.env.REDIRECT_URI}`;

  try {
    const tokenResponse = await axios.post(
      "https://api.line.me/oauth2/v2.1/token",
      qs.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINE_CHANNEL_ID,
        client_secret: process.env.LINE_CHANNEL_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { id_token } = tokenResponse.data;
    const profileResponse = await axios.get("https://api.line.me/v2/profile", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
      },
    });

    const profile = profileResponse.data;

    let user = await userService.findUserByLineId(profile.userId);

    if (!user) {
      user = await userService.createUserWithLineId({
        lineId: profile.userId,
        name: profile.displayName,
      });
    }

    delete user.password;
    delete user.lineId;

    const accessToken = tokenResponse.data.access_token;
    const idToken = tokenResponse.data.id_token;

    if (!user.uuid) {
      const payload = {
        userId: user.id,
        email: user.email,
        uuid: user.uuid,
      };
      const accessToken = jwtService.sign(payload);
      delete user.password;
      return res.status(200).json({ accessToken, idToken });
    }

    if (!accessToken || !idToken) {
      return res
        .status(400)
        .json({ message: "Invalid access token or id token" });
    }

    res.status(200).json({ accessToken, idToken });
  } catch (error) {
    console.error("Error during LINE Login callback:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

exports.linePostCallback = catchError(async (req, res) => {
  const { code, state } = req.body;
  const lineUserProfile = await axios.post(`${process.env.POST_CALLBACK_URI}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({ code }),
  });
  console.log(lineUserProfile, "lineUserProfile");
  res.status(200).json({ lineUserProfile });
});
