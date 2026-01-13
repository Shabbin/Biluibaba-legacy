import mongoose, { Schema, Model } from 'mongoose';
import type {
  IProduct,
  IProductCategory,
  IProductImage,
  IRatingBreakdown,
  IReview,
} from '../types/index.js';

const ProductCategorySchema = new Schema<IProductCategory>(
  {
    parent: String,
    category: String,
    sub: String,
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    filename: String,
    path: String,
  },
  { _id: false }
);

const RatingBreakdownSchema = new Schema<IRatingBreakdown>(
  {
    excellent: { type: Number, default: 0 },
    veryGood: { type: Number, default: 0 },
    good: { type: Number, default: 0 },
    average: { type: Number, default: 0 },
    poor: { type: Number, default: 0 },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserData',
      required: true,
    },
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const ProductSchema = new Schema<IProduct>(
  {
    productId: {
      type: String,
      unique: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    categories: [ProductCategorySchema],
    name: {
      type: String,
      required: [true, 'Please provide product name'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    images: [ProductImageSchema],
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
      min: [0, 'Price cannot be negative'],
    },
    size: Number,
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please provide product quantity'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Please provide product description'],
    },
    orderCount: String,
    featured: {
      type: Boolean,
      default: false,
    },
    vendorId: {
      type: Schema.Types.ObjectId,
      ref: 'VendorData',
      required: true,
    },
    vendorName: String,
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    ratingBreakdown: {
      type: RatingBreakdownSchema,
      default: () => ({
        excellent: 0,
        veryGood: 0,
        good: 0,
        average: 0,
        poor: 0,
      }),
    },
    reviews: [ReviewSchema],
    tags: [String],
    views: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'product-data',
    timestamps: true,
  }
);

// Pre-save middleware to calculate ratings summary
ProductSchema.pre('save', function (next) {
  if (this.reviews && this.reviews.length > 0) {
    // Count total reviews with comments
    this.totalReviews = this.reviews.filter(
      (review) => review.comment && review.comment.trim() !== ''
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

// Indexes for better query performance
ProductSchema.index({ slug: 1 });
ProductSchema.index({ productId: 1 });
ProductSchema.index({ 'categories.parent': 1, 'categories.category': 1 });
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ name: 'text', tags: 'text' });

const Product: Model<IProduct> = mongoose.model<IProduct>(
  'ProductData',
  ProductSchema
);

export default Product;
