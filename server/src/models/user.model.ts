import mongoose, { Schema, Model } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IUser, IWishlistItem, IShippingAddress } from '../types/index.js';

const WishlistSchema = new Schema<IWishlistItem>(
  {
    productId: {
      type: String,
      required: [true, 'Please provide product id'],
    },
  },
  { timestamps: true }
);

const ShippingSchema = new Schema<IShippingAddress>(
  {
    state: String,
    area: String,
    district: String,
    postcode: String,
    address: String,
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    authType: {
      type: String,
      required: [true, 'Please provide account type'],
      enum: ['email', 'google', 'facebook'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    avatar: String,
    password: {
      type: String,
      select: false,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    promotionalEmails: {
      type: Boolean,
      required: [true, 'Please provide promotional emails status'],
      default: false,
    },
    package: {
      type: String,
      required: [true, 'Please provide a package type'],
      enum: ['free', 'premium', 'enterprise'],
      default: 'free',
    },
    packageExpire: Number,
    invoiceIDs: [{
      type: Schema.Types.ObjectId,
      ref: 'OrderData',
    }],
    appointmentIDs: [{
      type: Schema.Types.ObjectId,
      ref: 'AppointmentData',
    }],
    adoptionIDs: [{
      type: Schema.Types.ObjectId,
      ref: 'AdoptionData',
    }],
    shipping: ShippingSchema,
    wishlist: [WishlistSchema],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    collection: 'user-data',
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
UserSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.getSignedToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      isVerified: this.verified,
      avatar: this.avatar,
      package: this.package,
      packageExpire: this.packageExpire,
    },
    process.env.TOKEN_SECRET ?? '',
    { expiresIn: process.env.TOKEN_EXPIRE ?? '7d' }
  );
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  return resetToken;
};

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ createdAt: -1 });

const User: Model<IUser> = mongoose.model<IUser>('UserData', UserSchema);

export default User;
