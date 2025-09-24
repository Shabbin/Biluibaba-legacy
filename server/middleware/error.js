const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, request, response, next) => {
  let error = { ...err };

  console.log(error);

  error.message = err.message;

  if (err.code === 11000) {
    const message = `Duplicate Field Value Enter`;
    error = new ErrorResponse(message, 400);
  }

  response
    .status(error.statusCode || 500)
    .json({ success: false, error: err.message || "Server Error" });
};

module.exports = errorHandler;
