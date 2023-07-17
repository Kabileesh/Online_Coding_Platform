require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Strategy: BearerStrategy } = require("passport-http-bearer");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const hashPassword = (req, res, next) => {
  const { password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }

    req.body.hash = hashedPassword;
    next();
  });
};
const credentials = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password", session: false },
      async (username, password, done) => {
        try {
          const user = await User.findOne(
            { username },
            { username: 1, _id: 1, hash: 1 }
          );
          if (!user) {
            return done(null, false);
          }
          const passwordMatch = await bcrypt.compare(password, user.hash);
          if (passwordMatch) {
            return done(null, { id: user.id, username: user.username });
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    new BearerStrategy(async (token, done) => {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        const existingUser = await User.findById(decoded.id);
        if (
          existingUser &&
          decoded.exp &&
          new Date().getTime() < decoded.exp * 1000
        ) {
          const user = { id: decoded.id, username: decoded.username };
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err);
      }
    })
  );
};

module.exports = {
  credentials,
  hashPassword,
};
