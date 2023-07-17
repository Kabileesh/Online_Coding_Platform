require("dotenv").config();
const passport = require("passport");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

// need to resolve user already exist error

const registerUser = async (req, res) => {
  const { name, username, phone, hash } = req.body;

  try {
    const exisitingUser = await User.find(
      { username: { $eq: username } },
      { _id: 0 }
    );
    if (exisitingUser.username === username) {
      return res.status(400).json({ error: "Username alredy Exist" });
    }
    const newUser = new User({
      name: name,
      username: username,
      hash: hash,
    });
    await newUser.save();
    passport.authenticate("local", { session: false })(
      req,
      res,
      async (err) => {
        const user = await User.findOne({ username: username });
        const accessToken = jwt.sign(
          {
            id: req.user.id,
            username: req.user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          process.env.SECRET
        );
        res.json({
          user: user,
          accessToken: accessToken,
        });
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.send("Enter valid email id");
  } else {
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      res.send("No user has been found");
    } else {
      passport.authenticate("local", { session: false })(req, res, (err) => {
        if (err) {
          return res.status(401).json({ error: "Authentication failed 2" });
        }
        const accessToken = jwt.sign(
          {
            id: req.user.id,
            username: req.user.username,
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          process.env.SECRET
        );
        res.json({
          user: req.user,
          accessToken: accessToken,
        });
      });
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
};
