const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  output: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      "Pending",
      "Compiling",
      "Running",
      "Accepted",
      "Failed",
      "Runtime Error",
    ],
    default: "Pending",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
