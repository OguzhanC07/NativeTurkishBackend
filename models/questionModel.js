const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, "Question must not be blank"],
    trim: true,
    maxlength: [500, "Question must have less or equal 500 characters"],
    minlength: [10, "Question must have more than 10 character"],
  },
  level: {
    type: String,
    enum: ["A1", "A2", "B1", "B2"],
    default: "A1",
    required: true,
  },
  alternatives: [
    {
      _id: false,
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
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
  ],
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
