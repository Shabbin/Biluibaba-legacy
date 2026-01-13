import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface IVendorAddress {
  store?: string;
  state?: string;
  area?: string;
  district?: string;
  postcode?: string;
  fullAddress?: string;
  pickupAddress?: string;
}

interface INid {
  front?: string;
  back?: string;
  number?: string;
}

interface ITax {
  tin?: string;
  tradeLicense?: string;
}

interface IBank {
  accountType?: string;
  accountName?: string;
  accountNumber?: string;
}

export interface IVendor extends Document {
  _id: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  type: string;
  phoneNumber: string;
  email: string;
  storeName: string;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  verified: boolean;
  verificationCode?: string;
  address?: IVendorAddress;
  nid?: INid;
  companyRegistration?: string;
  tax?: ITax;
  bank?: IBank;
  totalListedProducts: number;
  productIDs: Types.ObjectId[];
  orderIDs: Types.ObjectId[];
  ratings: number;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  getResetPasswordToken(): string;
}

const VendorAddressSchema = new Schema<IVendorAddress>(
  {
    store: String,
    state: String,
    area: String,
    district: String,
    postcode: String,
    fullAddress: String,
    pickupAddress: String,
  },
  { _id: false }
);

const VendorSchema = new Schema<IVendor>(
  {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    name: {
      type: String,
      required: [true, 'Please provide a valid name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please provide vendor type'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a valid phone number'],
    },
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    storeName: {
      type: String,
      required: [true, 'Please provide store name'],
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: String,
    address: VendorAddressSchema,
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
    totalListedProducts: {
      type: Number,
      default: 0,
    },
    productIDs: [{
      type: Schema.Types.ObjectId,
      ref: 'ProductData',
    }],
    orderIDs: [{
      type: Schema.Types.ObjectId,
      ref: 'OrderData',
    }],
    ratings: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'vendor-data',
    timestamps: true,
  }
);

// Hash password before saving
VendorSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
VendorSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
VendorSchema.methods.getSignedToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      status: this.status,
      name: this.name,
      isVerified: this.verified,
      storeName: this.storeName,
      type: 'vendor',
    },
    process.env.TOKEN_SECRET ?? '',
    { expiresIn: process.env.TOKEN_EXPIRE ?? '7d' }
  );
};

// Generate password reset token
VendorSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Indexes
VendorSchema.index({ email: 1 });
VendorSchema.index({ storeName: 1 });

const Vendor: Model<IVendor> = mongoose.model<IVendor>('VendorData', VendorSchema);

export default Vendor;
