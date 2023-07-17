require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const { credentials } = require("./auth/passport");
const router = require("./router/routes");
credentials(passport);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server started on port 8080 and db connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });

