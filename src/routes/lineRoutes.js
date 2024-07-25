const express = require("express");
const qs = require("querystring");

const router = express.Router();

router.get("/login", (req, res) => {
  const state = "some_random_string"; // คุณสามารถสร้างค่า state ที่ซับซ้อนได้
  const redirectUri = encodeURIComponent(
    "https://your-vps-url.com/line/callback"
  );
  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.LINE_CHANNEL_ID}&redirect_uri=${redirectUri}&state=${state}&scope=profile%20openid`;
  res.redirect(lineLoginUrl);
});

router.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  const redirectUri = "https://your-vps-url.com/line/callback";

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

    // จัดการข้อมูลโปรไฟล์ผู้ใช้และจัดเก็บลงฐานข้อมูล
    // profileResponse.data มีข้อมูลของผู้ใช้

    res.json(profileResponse.data);
  } catch (error) {
    console.error("Error during LINE Login callback:", error);
    res.status(500).send("Error during LINE Login callback");
  }
});

module.exports = router;
