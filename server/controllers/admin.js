const jwt = require("jsonwebtoken");

const ErrorResponse = require("../utils/ErrorResponse");

// Admin token function aka. "super-token" cookie
const sendAdminToken = async (statusCode, response) => {
  const token = jwt.sign(
    { id: process.env.ADMIN_ID },
    process.env.ADMIN_TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
  response
    .status(statusCode)
    .cookie("super-token", token, {
      httpOnly: true,
      domain: process.env.NODE_ENV == "production" ? ".biluibaba.com" : "",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "strict",
    })
    .json({ success: true });
};

module.exports.login = async (request, response, next) => {
  const { email, password } = request.body;

  // Check if email and password are provided
  if (!email || !password)
    return next(new ErrorResponse("Missing information", 422));

  // Check if email and password are correct from the .env file and send token
  // This could be replaced with a database check
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  )
    return sendAdminToken(200, response);
  else return next(new ErrorResponse("Incorrect email or password", 401));
};
