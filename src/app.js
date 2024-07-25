const express = require("express");
const rateLimit = require("express-rate-limit");

const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
//const logger = require("./middleware/logger");
// const errorHandler = require("./middleware/errorHandler");

const routes = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // limit each IP to request per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
// app.use(logger);

app.use("/api", routes);

// app.use(errorHandler);

module.exports = app;
