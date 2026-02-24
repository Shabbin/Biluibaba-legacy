const path = require("path");
const multer = require("multer");

const ErrorResponse = require("../utils/ErrorResponse");

const Vendor = require("../models/vendor.model");
const Vet = require("../models/vet.model");

module.exports.checkEmail = async (request, response, next) => {
  let { email } = request.body;

  if (!email)
    return next(
      new ErrorResponse("Please provide a valid email address to check", 404)
    );

  let vendor = await Vendor.findOne({ email });
  let vet = await Vet.findOne({ email });

  if (vendor || vet)
    return next(
      new ErrorResponse(
        "This email account is already registered with us. Please provide a different one or try logging in.",
        401
      )
    );
  else return response.status(200).json({ success: true });
};

module.exports.login = async (request, response, next) => {
  let { email, password } = request.body;

  if (!email || !password)
    return next(new ErrorResponse("Missing Information", 421));
  try {
    let appUser = await Vendor.findOne({ email }).select("+password");

    if (!appUser) appUser = await Vet.findOne({ email }).select("+password");

    if (!appUser)
      return next(new ErrorResponse("Invalid email or password", 401));

    const isPasswordMatch = await appUser.matchPassword(password);

    if (!isPasswordMatch)
      return next(new ErrorResponse("Invalid email or password", 401));

    return sendAppToken(appUser, 200, response);
  } catch (error) {
    next(
      new ErrorResponse("Server Error Occured. Please try again later", 500)
    );
  }
};

module.exports.logout = async (request, response, next) => {
  return response
    .status(200)
    .clearCookie("app-token", {
      httpOnly: true,
      domain:
        process.env.NODE_ENV == "production" ? ".biluibaba.com" : undefined,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ success: true, data: "Logged out successfully" });
};

const sendAppToken = async (app, statusCode, response) => {
  const token = app.getSignedToken();
  response
    .status(statusCode)
    .cookie("app-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
      domain:
        process.env.NODE_ENV === "production" ? ".biluibaba.com" : undefined,
      sameSite: "lax",
    })
    .json({
      success: true,
      status: app.status || "pending",
      type: app.type || (app.specialization ? "vet" : "vendor"),
    });
};
