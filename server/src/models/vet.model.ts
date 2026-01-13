import mongoose, { Schema, Model, Document, Types } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface ITimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  interval: number;
  availableSlots: string[];
}

interface IAppointmentSlots {
  monday?: ITimeSlot;
  tuesday?: ITimeSlot;
  wednesday?: ITimeSlot;
  thursday?: ITimeSlot;
  friday?: ITimeSlot;
  saturday?: ITimeSlot;
  sunday?: ITimeSlot;
}

interface IVetAddress {
  area?: string;
  district?: string;
  postcode?: string;
  fullAddress?: string;
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

export interface IVet extends Document {
  _id: Types.ObjectId;
  status: 'pending' | 'approved' | 'rejected';
  name: string;
  email: string;
  phoneNumber: string;
  gender: 'male' | 'female' | 'other';
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  verified: boolean;
  verificationCode?: string;
  address?: IVetAddress;
  degree?: string;
  license?: string;
  hospital?: string;
  certificate?: string;
  bio?: string;
  profilePicture?: string;
  nid?: INid;
  tax?: ITax;
  appointments: {
    slots?: IAppointmentSlots;
    fee?: number;
  };
  ratings: number;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  getResetPasswordToken(): string;
}

const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    startTime: String,
    endTime: String,
    duration: Number,
    interval: Number,
    availableSlots: [String],
  },
  { _id: false }
);

const VetSchema = new Schema<IVet>(
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
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a valid phone number'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
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
    address: {
      area: String,
      district: String,
      postcode: String,
      fullAddress: String,
    },
    degree: String,
    license: String,
    hospital: String,
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
      tradeLicense: String,
    },
    appointments: {
      slots: {
        monday: TimeSlotSchema,
        tuesday: TimeSlotSchema,
        wednesday: TimeSlotSchema,
        thursday: TimeSlotSchema,
        friday: TimeSlotSchema,
        saturday: TimeSlotSchema,
        sunday: TimeSlotSchema,
      },
      fee: {
        type: Number,
        default: 0,
      },
    },
    ratings: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: 'vet-data',
    timestamps: true,
  }
);

// Hash password before saving
VetSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
VetSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
VetSchema.methods.getSignedToken = function (): string {
  return jwt.sign(
    {
      id: this._id,
      status: this.status,
      name: this.name,
      isVerified: this.verified,
      type: 'vet',
    },
    process.env.TOKEN_SECRET ?? '',
    { expiresIn: process.env.TOKEN_EXPIRE ?? '7d' }
  );
};

// Generate password reset token
VetSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Indexes
VetSchema.index({ email: 1 });
VetSchema.index({ status: 1 });

const Vet: Model<IVet> = mongoose.model<IVet>('VetData', VetSchema);

export default Vet;
