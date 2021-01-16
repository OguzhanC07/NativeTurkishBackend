const express = require("express");
const questionController = require("../controllers/questionController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, questionController.getAllQuestions)
  .post(
    authController.protect,
    authController.restrictTo("Admin"),
    questionController.addQuestion
  );

router
  .route("/:id")
  .get(authController.protect, questionController.getQuestion)
  .patch(
    authController.protect,
    authController.restrictTo("Admin"),
    questionController.updateQuestion
  )
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    questionController.deleteQuestion
  );

module.exports = router;
