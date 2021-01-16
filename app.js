const express = require("express");
const morgan = require("morgan");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

//development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//body parsing
app.use(express.json());

//Routes

//Error Route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
