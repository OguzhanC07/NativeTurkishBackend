const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.addQuestion = catchAsync(async (req, res, next) => {
  const newQuestion = await Question.create({
    question_text: req.question,
    level: req.body.level,
    alternatives: req.body.alternatives,
  });
  res.status(201).json(newQuestion);
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return next(new AppError("Id is not correct", 404));
  }

  res.status(200).json(question);
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError("No tour found with that id", 404));
  }

  res.status(204).json({
    status: "success",
  });
});

exports.getQuestionsByLevel = catchAsync(async (req, res, next) => {
  const questions = Question.find();

  res.status(200).json(questions);
});

exports.getQuestion = catchAsync(async (req, res, next) => {
    const _id = req.params.id,

    const question = await Question.findOne({ _id });
    if (!question) {
        return next(new AppError('Question id is not valid'), 404);
    }

    return res.status(200).json(question);
    
})
