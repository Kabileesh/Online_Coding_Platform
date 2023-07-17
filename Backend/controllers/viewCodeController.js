const Submission = require("../model/submissionModel");

const viewCode = async (req, res) => {
  try {
    const code_id = req.query.code_id;
    const selectedCode = await Submission.findById(code_id, { user_id: 0 });
    res.send(selectedCode);
  } catch (err) {
    console.log(err);
  }
};

module.exports = viewCode;
