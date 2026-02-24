const { google } = require("googleapis");
const axios = require("axios");
const crypto = require("crypto");

const User = require("../models/user.model");
const Orders = require("../models/order.model");
const Appointments = require("../models/appointment.model");

const ErrorResponse = require("../utils/ErrorResponse");
const SendMail = require("../utils/SendMail");

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

module.exports.getUserInfo = async (request, response, next) => {
  const user = await User.findById(request.user.id).select("-password");

  response.status(200).json({ success: true, data: user });
};

module.exports.updateUserInfo = async (request, response, next) => {
  const { name, phoneNumber, shippingAddress } = request.body;

  if (!name || !phoneNumber)
    return next(new ErrorResponse("Missing information", 422));

  const user = await User.findById(request.user.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  user.name = name;
  user.phoneNumber = phoneNumber;

  if (shippingAddress) user.shipping = shippingAddress;

  await user.save();

  response.status(200).json({ success: true, data: "Profile updated" });
};

module.exports.getOrders = async (request, response, next) => {
  const { type } = request.query;

  if (!type) return next(new ErrorResponse("Missing information", 422));

  const user = await User.findById(request.user.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  const filter =
    type === "all" ? { userId: user._id } : { userId: user._id, status: type };

  const orders = await Orders.find(filter);

  return response.status(200).json({ success: true, orders });
};

module.exports.getBookings = async (request, response, next) => {
  const { type } = request.query;

  if (!type) return next(new ErrorResponse("Missing information", 422));

  const user = await User.findById(request.user.id);

  if (!user) return next(new ErrorResponse("User not found", 404));

  const bookings = await Appointments.find({
    user: user._id,
    type,
  }).populate("vet");

  return response.status(200).json({ success: true, bookings });
};

module.exports.login = async (request, response, next) => {
  const { type, email, password, from } = request.body;

  if (!type) return next(new ErrorResponse("Missing information", 422));

  if (type === "google") handleGoogleOAuth(response, from);
 else if (type === "facebook") handleFacebookOAuth(response, from);
  else {
    if (!email || !password)
      return next(new ErrorResponse("Missing information", 422));

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user)
        return next(new ErrorResponse("Incorrect email or password", 401));

      const isPasswordMatch = await user.matchPassword(password);

      if (!isPasswordMatch)
        return next(new ErrorResponse("Incorrect email or password", 401));

      return sendToken(user, 200, response);
    } catch (error) {
      next(
        new ErrorResponse(
          "Server Error Occurred. Please try again later...",
          500
        )
      );
    }
  }
};

module.exports.register = async (request, response, next) => {
  let { type, name, phoneNumber, email, password } = request.body;

  if (!type) return next(new ErrorResponse("Please provide auth type", 422));

  if (type === "google") handleGoogleOAuth(response);
else if (type === "facebook") handleFacebookOAuth(response, "/");
  else {
    if (!name || !phoneNumber || !email || !password)
      return next(new ErrorResponse("Missing information", 422));

    const user = await User.findOne({ email: email });

    if (user)
      return next(
        new ErrorResponse(
          "Account already exists. Please try logging in...",
          401
        )
      );

    const url = request.protocol + "://" + request.get("host");
    let newUser = await registerUser(
      name,
      email,
      phoneNumber,
      password,
      "traditional",
      url + "/uploads/profile/default.jpg"
    );

    return sendToken(newUser, 200, response);
  }
};

module.exports.authenticateGoogle = async (request, response, next) => {
  const { code, state } = request.query;

  if (!code)
    return response
      .status(400)
      .json({ success: false, data: "Missing 'code' parameter" });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const user = await User.findOne({ email: data.email });

    if (user) return redirectAndSendToken(state || "/", user, 200, response);
    else {
      let newUser = await registerUser(
        data.name,
        data.email,
        "",
        "",
        "google",
        data.picture
      );

      return redirectAndSendToken(state || "/", newUser, 200, response);
    }
  } catch (error) {
    console.error(error);
    response.redirect(`${process.env.FRONTEND_URL}/login`);
  }
};

module.exports.authenticateFacebook = async (request, response) => {
  const { code, state } = request.query;

  if (!code) return response.status(400).send("No code returned from facebook");

  try {
    // 1) Exchange code -> access token
    const tokenResponse = await axios.get(
      `https://graph.facebook.com/v11.0/oauth/access_token` +
        `?client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
        `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
        `&code=${encodeURIComponent(code)}`
    );

    const accessToken = tokenResponse.data.access_token;

    // 2) Fetch user profile
    const userResponse = await axios.get(
      `https://graph.facebook.com/me` +
        `?fields=id,name,email,picture.width(400).height(400)` +
        `&access_token=${encodeURIComponent(accessToken)}`
    );

    const fb = userResponse.data || {};
    const fbId = fb.id;
    const name = fb.name || "Facebook User";
    const email = typeof fb.email === "string" ? fb.email.trim().toLowerCase() : "";
    const avatar = fb.picture?.data?.url;

    if (!fbId) {
      return response.redirect(`${process.env.FRONTEND_URL}/login?error=FACEBOOK_NO_ID`);
    }

    // 3) Find by facebookId (primary key)
    let user = await User.findOne({ "oauth.facebookId": fbId });

    // 4) Optional: link by email if exists (only if the email is verified in our DB)
    if (!user && email) {
      const existing = await User.findOne({ email });
      if (existing && existing.emailVerified) {
        existing.oauth = existing.oauth || {};
        existing.oauth.facebookId = fbId;
        existing.oauth.facebookLinkedAt = new Date();
        if (avatar && !existing.avatar) existing.avatar = avatar;
        await existing.save();
        user = existing;
      }
    }

    // 5) Create new user even if email is missing
    if (!user) {
      user = await registerUser(
        name,
        email, // may be ""
        "",
        "",
        "facebook",
        avatar || `${process.env.FRONTEND_URL}/uploads/profile/default.jpg`
      );

      user.oauth = user.oauth || {};
      user.oauth.facebookId = fbId;
      user.oauth.facebookLinkedAt = new Date();
      await user.save();
    } else {
      // Keep some data fresh
      let changed = false;
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        changed = true;
      }
      if (email && !user.email) {
        user.email = email;
        user.emailVerified = true;
        changed = true;
      }
      if (changed) await user.save();
    }

    // 6) Send cookie + redirect back
    return redirectAndSendToken(state || "/", user, 200, response);
  } catch (error) {
    console.error("Facebook auth error:", error?.response?.data || error.message);
    return response.redirect(`${process.env.FRONTEND_URL}/login?error=FACEBOOK_AUTH_FAILED`);
  }
};

module.exports.logoutUser = (request, response, next) => {
  return response
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      domain:
        process.env.NODE_ENV == "production" ? ".biluibaba.com" : undefined,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .json({ success: true, data: "Logged out successfully" });
};

const sendToken = async (user, statusCode, response) => {
  const token = user.getSignedToken();
  response
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? ".biluibaba.com" : undefined,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    })
    .json({ success: true });
};

const redirectAndSendToken = async (url, user, statusCode, response) => {
  const token = user.getSignedToken();
  response
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      domain:
        process.env.NODE_ENV === "production" ? ".biluibaba.com" : undefined,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: "lax",
    })
    .redirect(`${process.env.FRONTEND_URL}${url}`);
};

const registerUser = async (
  name,
  email,
  phoneNumber,
  password,
  authType,
  avatar
) => {
  const doc = {
    name,
    verified: true, // keep your legacy field
    authType,
    phoneNumber,
    password,
    avatar,
    package: "free",
    promotionalEmails: true,
  };

  // only set email if we actually have one
  if (email && typeof email === "string" && email.trim()) {
    doc.email = email.trim().toLowerCase();
    doc.emailVerified = true;
  } else {
    doc.emailVerified = false;
  }

  const user = await User.create(doc);
  return user;
};

const handleGoogleOAuth = async (response, state) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    state,
  });
  return response.status(200).json({ success: true, url });
};

const handleFacebookOAuth = async (response, state = "/") => {
  const facebookAuthURL =
    `https://www.facebook.com/v11.0/dialog/oauth` +
    `?client_id=${process.env.FACEBOOK_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.FACEBOOK_REDIRECT_URI)}` +
    `&scope=email,public_profile` +
    `&auth_type=rerequest` +
    `&state=${encodeURIComponent(state)}`;

  return response.status(200).json({ success: true, url: facebookAuthURL });
};

module.exports.forgotPassword = async (request, response, next) => {
  const { email } = request.body;

  if (!email) return next(new ErrorResponse("Please provide an email", 422));

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not for security
    return response.status(200).json({ 
      success: true, 
      data: "If an account exists with this email, you will receive a password reset link" 
    });
  }
  if (!user.email) {
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

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save();

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  // Send email
  try {
    await SendMail({
      to: user.email,
      subject: "Password Reset Request - Biluibaba",
      template: "password-reset",
      data: {
        name: user.name,
        resetUrl,
      },
    });

    return response.status(200).json({ 
      success: true, 
      data: "If an account exists with this email, you will receive a password reset link" 
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

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

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) 
    return next(new ErrorResponse("Invalid or expired token", 400));

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  return response.status(200).json({ 
    success: true, 
    data: "Password reset successful" 
  });
};
