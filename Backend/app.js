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

// app.use(
//   cors({
//     origin: ["*", "https://gilded-kleicha-f8ced8.netlify.app/"],
//   })
// );

const corsOpts = {
  origin: "*",

  methods: ["GET", "POST"],

  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOpts));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(8080, () => {
      console.log("Server started and db connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
