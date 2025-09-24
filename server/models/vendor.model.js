const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const VendorSchema = new mongoose.Schema(
  {
    status: String,
    name: {
      type: String,
      required: [true, "Please provide a valid name"],
    },
    type: {
      type: String,
      required: [true, "Please provide vendor type"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Please provide a valid email"],
    },
    storeName: {
      type: String,
      required: [true, "Please provide store name"],
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verified: Boolean,
    verificationCode: String,
    address: {
      store: String,
      state: String,
      area: String,
      district: String,
      postcode: String,
      fullAddress: String,
      pickupAddress: String,
    },
    nid: {
      front: String,
      back: String,
      number: String,
    },
    companyRegistration: String,
    tax: {
      tin: String,
      tradeLicense: String,
    },
    bank: {
      accountType: String,
      accountName: String,
      accountNumber: String,
    },
    totalListedProducts: Number,
    productIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductData" }],
    orderIDs: [{ type: mongoose.Schema.Types.ObjectId, ref: "OrderData" }],
    ratings: { type: Number, default: 0 },
  },
  { collection: "vendor-data", timestamps: true }
);

VendorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

VendorSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

VendorSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      status: this.status,
      name: this.name,
      isVerified: this.verified,
      type: this.type,
      storeName: this.storeName,
      type: "vendor",
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
};

VendorSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const model = mongoose.model("VendorData", VendorSchema);

module.exports = model;
