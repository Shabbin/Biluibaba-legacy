const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productId: String,
    status: Boolean,
    slug: String,
    categories: [
      {
        parent: String,
        category: String,
        sub: String,
      },
    ],
    name: String,
    images: [{ filename: String, path: String }],
    price: Number,
    size: Number,
    discount: Number,
    quantity: Number,
    description: String,
    orderCount: String,
    featured: Boolean,
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "VendorData" },
    vendorName: String,
    ratings: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratingBreakdown: {
      excellent: { type: Number, default: 0 },
      veryGood: { type: Number, default: 0 },
      good: { type: Number, default: 0 },
      average: { type: Number, default: 0 },
      poor: { type: Number, default: 0 },
    },
    reviews: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
        comment: String,
        rating: { type: Number, min: 1, max: 5 },
        date: { type: Date, default: Date.now },
      },
    ],
    tags: [String],
    views: { type: Number, default: 0 },
    isDeleted: Boolean,
  },
  { collection: "product-data", timestamps: true }
);

// Pre-save middleware to calculate ratings summary before saving the document
ProductSchema.pre("save", function (next) {
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

    // Reset rating breakdown
    this.ratingBreakdown = {
      excellent: 0,
      veryGood: 0,
      good: 0,
      average: 0,
      poor: 0,
    };

    // Update rating breakdown
    this.reviews.forEach((review) => {
      switch (review.rating) {
        case 5:
          this.ratingBreakdown.excellent += 1;
          break;
        case 4:
          this.ratingBreakdown.veryGood += 1;
          break;
        case 3:
          this.ratingBreakdown.good += 1;
          break;
        case 2:
          this.ratingBreakdown.average += 1;
          break;
        case 1:
          this.ratingBreakdown.poor += 1;
          break;
      }
    });
  }

  next();
});

const model = mongoose.model("ProductData", ProductSchema);

module.exports = model;
