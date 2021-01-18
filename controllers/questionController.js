const Question = require("../models/questionModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const mongoose = require('mongoose')

exports.addQuestion = catchAsync(async (req, res, next) => {
  const newQuestion = await Question.create(req.body);
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

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  const questions = await Question.find();

  res.status(200).json(questions);
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const _id = req.params.id;

  const question = await Question.findOne({ _id });
  if (!question) {
    return next(new AppError("Question id is not valid"), 404);
  }

  res.status(200).json(question);
});

exports.getQuestionByLevel = catchAsync(async (req, res, next) => {
  const userId = req.query.userId; 
  const level = req.query.level;

  //check if user want to pass this
  const questionId = req.query.questionId;
  if (questionId!== undefined && questionId.length>2) {
    const nextQuestion = await Question.findOne({ answeredUsers: { $ne: mongoose.Types.ObjectId(userId) }, level, _id: {$ne:questionId} } )
    res.status(200).json(nextQuestion);
  }
  
  const question = await Question.findOne({ answeredUsers: { $ne: mongoose.Types.ObjectId(userId) }, level })

  res.status(200).json(question);
})

exports.correctQuestion = catchAsync(async (req, res, next) => {
  const _id = req.body.questionId;
  const question = await Question.findOne({_id});
  question.answeredUsers.push(req.body.userId);
  question.save();
  
  res.status(200).json(question);
})