const express = require("express");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const helment = require("helmet");
//const logger = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

const routes = require("./routes");

const app = express();

app.use(helment());
const allowedOrigin = "chrome-extension://bakgomgejopenjmjaipflkhjnnecdegm";

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 60, // limit each IP to request per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const corsOptions = {
  origin: [/^chrome-extension:\/\/.+/], // ระบุโดเมนของ Chrome Extension
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(limiter);

app.use(morgan("dev"));

const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
app.use(morgan("combined", { stream: logStream }));

app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use(logger);

app.use("/api", routes);

app.use(errorHandler);

module.exports = app;
