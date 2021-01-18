const express = require("express");
const questionController = require("../controllers/questionController");
const authController = require("../controllers/authController");

const router = express.Router();
router.route('/answer').post(authController.protect, questionController.correctQuestion);
router.route('/quizQuestion').get(authController.protect, questionController.getQuestionByLevel);
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
  .put(
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
