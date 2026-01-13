import mongoose, { Schema, Model, Document, Types } from 'mongoose';

interface IPrescription {
  medication: string;
  dose: string;
  instruction: string;
}

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  appointmentId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  phoneNumber: string;
  petName: string;
  petConcern: string[];
  detailedConcern?: string;
  species: string;
  age: string;
  breed: string;
  date: string;
  time: string;
  totalAmount: number;
  paymentStatus: boolean;
  paymentSessionKey?: string;
  type: 'online' | 'home-visit';
  homeAddress?: string;
  roomLink?: string;
  prescription: IPrescription[];
  vet: Types.ObjectId;
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>(
  {
    medication: {
      type: String,
      required: true,
    },
    dose: {
      type: String,
      required: true,
    },
    instruction: String,
  },
  { _id: false }
);

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    petName: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    petConcern: {
      type: [String],
      required: [true, 'At least one concern is required'],
    },
    detailedConcern: String,
    species: {
      type: String,
      required: [true, 'Species is required'],
    },
    age: {
      type: String,
      required: [true, 'Age is required'],
    },
    breed: String,
    date: {
      type: String,
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String,
      required: [true, 'Appointment time is required'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    paymentSessionKey: String,
    type: {
      type: String,
      enum: ['online', 'home-visit'],
      required: [true, 'Appointment type is required'],
    },
    homeAddress: String,
    roomLink: String,
    prescription: {
      type: [PrescriptionSchema],
      default: [],
    },
    vet: {
      type: Schema.Types.ObjectId,
      ref: 'VetData',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'UserData',
      required: true,
    },
  },
  {
    collection: 'appointment-data',
    timestamps: true,
  }
);

// Indexes
AppointmentSchema.index({ appointmentId: 1 });
AppointmentSchema.index({ vet: 1, date: 1 });
AppointmentSchema.index({ user: 1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ date: 1, time: 1 });

const Appointment: Model<IAppointment> = mongoose.model<IAppointment>(
  'AppointmentData',
  AppointmentSchema
);

export default Appointment;
