const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const WishlistSchema = new mongoose.Schema(
  {
    productId: { type: String, required: [true, "Please provide product id"] },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    phoneNumber: String,
    authType: {
      type: String,
      required: [true, "Please provide account type"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email address"],
      unique: true,
    },
    verified: Boolean,
    verificationCode: String,
    avatar: String,
    password: String,
    promotionalEmails: {
      type: Boolean,
      required: [true, "Please provide promotional emails status"],
    },
    package: {
      type: String,
      required: [true, "Please provide a package type"],
    },
    packageExpire: Number,
    invoiceIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderData" }],
    appointmentIDs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AppointmentData" },
    ],
    adoptionIDs: [
      { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionData" },
    ],
    shipping: {
      state: String,
      area: String,
      district: String,
      postcode: String,
      address: String,
    },
    wishlist: [WishlistSchema],
    authType: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { collection: "user-data", timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      isVerified: this.verified,
      avatar: this.avatar,
      type: this.type,
      package: this.package,
      packageExpire: this.packageExpire,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const model = mongoose.model("UserData", UserSchema);

module.exports = model;
