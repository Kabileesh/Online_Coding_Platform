const Submission = require("../model/submissionModel");

const submitCode = async (req, res) => {
  try {
    const { code, language, status, output } = req.body;
    const user_id = req.user.id;

    const newSubmission = new Submission({
      user_id: user_id,
      code: code,
      language: language,
      status: status,
      output: output,
    });

    await newSubmission.save();
    res.send(output);
  } catch (err) {
    console.log(err);
  }
};

module.exports = submitCode;
