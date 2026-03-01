const path = require("path");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");
const handlebars = require("handlebars");

const ErrorResponse = require("../utils/ErrorResponse");
const { sendEmail } = require("../utils/SendMail");

const Vendor = require("../models/vendor.model");
const Vet = require("../models/vet.model");

const passwordResetTemplate = fs.readFileSync(
  path.join(__dirname, "../templates/password-reset.hbs"),
  "utf-8"
);

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

module.exports.forgotPassword = async (request, response, next) => {
  const { email } = request.body;

  if (!email) return next(new ErrorResponse("Please provide an email", 422));

  // Search both vendor and vet collections
  let appUser = await Vendor.findOne({ email });
  if (!appUser) appUser = await Vet.findOne({ email });

  if (!appUser) {
    // Don't reveal if user exists or not for security
    return response.status(200).json({
      success: true,
      data: "If an account exists with this email, you will receive a password reset link",
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  appUser.resetPasswordToken = hashedToken;
  appUser.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await appUser.save();

  // Create reset URL — points to the vendor/vet portal frontend
  const resetUrl = `${process.env.APP_FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send email
  try {
    const message = handlebars.compile(passwordResetTemplate)({
      name: appUser.name,
      resetUrl,
    });

    await sendEmail({
      to: appUser.email,
      subject: "Password Reset Request - Biluibaba",
      message,
    });

    return response.status(200).json({
      success: true,
      data: "If an account exists with this email, you will receive a password reset link",
    });
  } catch (error) {
    appUser.resetPasswordToken = undefined;
    appUser.resetPasswordExpire = undefined;
    await appUser.save();

    return next(new ErrorResponse("Email could not be sent", 500));
  }
};

module.exports.resetPassword = async (request, response, next) => {
  const { token, newPassword } = request.body;

  if (!token || !newPassword)
    return next(new ErrorResponse("Missing information", 422));

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Search both vendor and vet collections
  let appUser = await Vendor.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!appUser) {
    appUser = await Vet.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
  }

  if (!appUser)
    return next(new ErrorResponse("Invalid or expired token", 400));

  appUser.password = newPassword;
  appUser.resetPasswordToken = undefined;
  appUser.resetPasswordExpire = undefined;
  await appUser.save();

  return response.status(200).json({
    success: true,
    data: "Password reset successful",
  });
};
