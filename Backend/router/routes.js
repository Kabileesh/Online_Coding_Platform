const express = require("express");
const passport = require("passport");
const { loginUser, registerUser } = require("../controllers/loginController");
const { hashPassword } = require("../auth/passport");
const { executeCode } = require("../controllers/executeCodeController");
const submitCode = require("../controllers/submissionController");
const verifyToken = require("../controllers/verifyTokenController");
const viewSubmission = require("../controllers/viewSubmissionController");
const viewCode = require("../controllers/viewCodeController");
const router = express.Router();

router.post("/verify-token", verifyToken);

router.get("/view-code", passport.authenticate('bearer', { session: false }), viewCode);
router.get("/view-submissions", passport.authenticate('bearer', { session: false }), viewSubmission);
router.post("/execute", executeCode);
router.post("/submit-code", passport.authenticate('bearer', { session: false }), submitCode);
router.post("/register", hashPassword, registerUser);
router.post("/login", loginUser);
router.get("/", (req, res) => {
  res.json({ response: "Home Page" });
});

module.exports = router;
