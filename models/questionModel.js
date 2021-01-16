const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question_text: {
    type: String,
    required: [true, "Question must have a name"],
    trim: true,
    maxlength: [500, "Question must have less or equal 500 characters"],
    minlength: [10, "Question must have more than 10 character"],
  },
  level: String,
  alternatives: [
    {
      answer: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: String,
        required: true,
        default: false,
      },
    },
  ],
  answeredUsers: [
    {
      userId: mongoose.Types.ObjectId,
    },
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
