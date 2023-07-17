const Submission = require("../model/submissionModel");

const viewSubmission = async (req, res) => {
  try {
    const user_id = req.user.id;
    const userSubmissions = await Submission.find({ user_id: user_id }).sort({timestamp: -1});
    res.send(userSubmissions);
  } catch (err) {
    console.log(err);
  }
};

module.exports = viewSubmission;
