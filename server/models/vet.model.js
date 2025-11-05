const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const VetSchema = new mongoose.Schema(
  {
    status: Boolean,
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please provide your Phone Number"],
    },
    gender: {
      type: String,
      required: [true, "Please provide your gender"],
    },
    password: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    address: String,
    verified: Boolean,
    verificationCode: String,
    degree: String,
    license: String,
    hospital: String,
    address: {
      state: String,
      district: String,
      postcode: String,
      fullAddress: String,
    },
    certificate: String,
    bio: String,
    profilePicture: String,
    nid: {
      front: String,
      back: String,
      number: String,
    },
    tax: {
      tin: String,
    },
    appointments: {
      slots: {
        monday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        tuesday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        wednesday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        thursday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        friday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        saturday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
        sunday: {
          startTime: String,
          endTime: String,
          duration: String,
          interval: String,
          availableSlots: [String],
        },
      },
      online: {
        fee: Number,
        status: Boolean,
      },
      physical: {
        fee: Number,
        status: Boolean,
      },
      emergency: {
        fee: Number,
        status: Boolean,
      },
      instantChat: {
        status: Boolean,
      },
      homeService: {
        fee: Number,
        status: Boolean,
      },
    },
    totalRatings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratings: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now },
      },
    ],
    bank: {
      accountType: String,
      accountName: String,
      accountNumber: String,
    },
    specializedZone: [
      {
        pet: String,
        concerns: [String],
      },
    ],
  },
  { collection: "vet-data", timestamps: true }
);

VetSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();

  if (this.reviews && this.reviews.length > 0) {
    // Count total reviews with comments
    this.totalReviews = this.reviews.filter(
      (review) => review.comment && review.comment.trim() !== ""
    ).length;

    // Count total ratings
    this.totalRatings = this.reviews.length;

    // Calculate average rating
    const totalRatingPoints = this.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    this.ratings = totalRatingPoints / this.totalRatings;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

VetSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

VetSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      isVerified: this.verified,
      type: "vet",
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRE }
  );
};

VetSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const model = mongoose.model("VetData", VetSchema);

module.exports = model;
