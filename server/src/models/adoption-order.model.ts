import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export interface IAdoptionOrder extends Document {
  _id: Types.ObjectId;
  orderId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  payment: number;
  name: string;
  phoneNumber: string;
  area?: string;
  address: string;
  whyAdopt: string;
  petProof?: string;
  paymentSessionKey?: string;
  takeCareOfPet: string;
  userId: Types.ObjectId;
  adoptionId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AdoptionOrderSchema = new Schema<IAdoptionOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    payment: {
      type: Number,
      default: 0,
      min: 0,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    area: String,
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    whyAdopt: {
      type: String,
      required: [true, 'Please provide reason for adoption'],
    },
    petProof: String,
    paymentSessionKey: String,
    takeCareOfPet: {
      type: String,
      required: [true, 'Please describe how you will take care of the pet'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserData',
      required: true,
    },
    adoptionId: {
      type: Schema.Types.ObjectId,
      ref: 'AdoptionData',
      required: true,
    },
  },
  {
    collection: 'adoption-order-data',
    timestamps: true,
  }
);

// Indexes
AdoptionOrderSchema.index({ orderId: 1 });
AdoptionOrderSchema.index({ userId: 1 });
AdoptionOrderSchema.index({ adoptionId: 1 });
AdoptionOrderSchema.index({ status: 1 });

const AdoptionOrder: Model<IAdoptionOrder> = mongoose.model<IAdoptionOrder>(
  'AdoptionOrderData',
  AdoptionOrderSchema
);

export default AdoptionOrder;
