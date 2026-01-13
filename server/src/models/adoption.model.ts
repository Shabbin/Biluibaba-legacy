import mongoose, { Schema, Model, Document, Types } from 'mongoose';

interface IAdoptionImage {
  filename: string;
  path: string;
}

export interface IAdoption extends Document {
  _id: Types.ObjectId;
  adoptionId: string;
  status: 'pending' | 'approved' | 'rejected' | 'adopted';
  name: string;
  species: string;
  gender: 'male' | 'female';
  age: string;
  breed: string;
  size: 'small' | 'medium' | 'large';
  vaccinated: string;
  neutered: string;
  color: string[];
  location: string;
  description: string;
  phoneNumber: string;
  images: IAdoptionImage[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdoptionImageSchema = new Schema<IAdoptionImage>(
  {
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const AdoptionSchema = new Schema<IAdoption>(
  {
    adoptionId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'adopted'],
      default: 'pending',
    },
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'Gender is required'],
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
    },
    breed: {
      type: String,
      required: [true, 'Breed is required'],
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large'],
    },
    vaccinated: String,
    neutered: String,
    color: {
      type: [String],
      default: [],
    },
    location: String,
    description: {
      type: String,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    images: {
      type: [AdoptionImageSchema],
      default: [],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserData',
      required: true,
    },
  },
  {
    collection: 'adoption-data',
    timestamps: true,
  }
);

// Indexes
AdoptionSchema.index({ adoptionId: 1 });
AdoptionSchema.index({ status: 1 });
AdoptionSchema.index({ species: 1 });
AdoptionSchema.index({ userId: 1 });
AdoptionSchema.index({ createdAt: -1 });

const Adoption: Model<IAdoption> = mongoose.model<IAdoption>('AdoptionData', AdoptionSchema);

export default Adoption;
