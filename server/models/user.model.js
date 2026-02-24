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
    name: { type: String, required: [true, "Please provide your name"] },

   phoneNumber: { type: String, trim: true },

    authType: {
      type: String,
      required: [true, "Please provide account type"],
      enum: ["traditional", "google", "facebook"],
    },

email: {
  type: String,
  unique: true,
  sparse: true,   // critical when optional
  lowercase: true,
  trim: true,
},
emailVerified: { type: Boolean, default: false },
phoneVerified: { type: Boolean, default: false },
    oauth: {
      facebookId: { type: String, unique: true, sparse: true, index: true },
      googleId: { type: String, unique: true, sparse: true, index: true },
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
    appointmentIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "AppointmentData" }],
    adoptionIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "AdoptionData" }],

    shipping: {
      state: String,
      area: String,
      district: String,
      postcode: String,
      address: String,
    },

    wishlist: [WishlistSchema],

    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { collection: "user-data", timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (!this.password) return next(); // don't hash empty/null

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

UserSchema.methods.matchPassword = async function (password) {
  if (!this.password) return false;
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      isVerified: this.verified,
      avatar: this.avatar,
      type: this.authType,
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
