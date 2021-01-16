const express = require("express");
const { model } = require("mongoose");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.getAllUsers
  );

router
  .route("/:id")
  .delete(
    authController.protect,
    authController.restrictTo("Admin"),
    userController.banUsers
  );

module.exports = router;
