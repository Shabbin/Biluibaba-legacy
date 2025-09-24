const jwt = require("jsonwebtoken");

const ErrorResponse = require("../utils/ErrorResponse");

const User = require("../models/user.model");
const Vendor = require("../models/vendor.model");
const Vet = require("../models/vet.model");

// Protect user middleware
module.exports.protectUser = async (request, response, next) => {
  try {
    const token = request.cookies?.token;

    if (!token)
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await User.findById(decoded.id);

    if (!user)
      return next(
        new ErrorResponse(
          "This route is only authorized for user accounts",
          401
        )
      );

    request.user = user;

    return next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Protect vendor middleware
module.exports.protectVendor = async (request, response, next) => {
  try {
    const token =
      request.cookies?.["app-token"] ||
      request.headers.authorization.split(" ")[1];

    if (!token)
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const vendor = await Vendor.findById(decoded.id);

    if (!vendor)
      return next(
        new ErrorResponse(
          "This route is only authorized for vendor accounts",
          401
        )
      );

    request.vendor = vendor;

    return next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

module.exports.protectVet = async (request, response, next) => {
  try {
    const token =
      request.cookies?.["app-token"] ||
      request.headers.authorization.split(" ")[1];

    if (!token)
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const vet = await Vet.findById(decoded.id);

    if (!vet)
      return next(
        new ErrorResponse("This route is only authorized for vet accounts", 401)
      );

    request.vet = vet;

    return next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};

// Protect admin middleware
module.exports.protectAdmin = async (request, response, next) => {
  try {
    const token = request.cookies?.["super-token"];

    if (!token)
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );

    const decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET);

    if (decoded.id !== process.env.ADMIN_ID)
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );

    return next();
  } catch (error) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
};
