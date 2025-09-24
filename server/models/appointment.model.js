const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    appointmentId: String,
    status: String,
    phoneNumber: String,
    petName: String,
    petConcern: [String],
    detailedConcern: String,
    species: String,
    age: String,
    breed: String,
    date: String,
    time: String,
    totalAmount: Number,
    paymentStatus: Boolean,
    paymentSessionKey: String,
    type: String,
    homeAddress: String,
    prescription: [
      {
        medication: String,
        dose: String,
        instruction: String,
      },
    ],
    vet: { type: mongoose.Schema.Types.ObjectId, ref: "VetData" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  },
  { collection: "appointment-data", timestamps: true }
);

const model = mongoose.model("AppointmentData", AppointmentSchema);

module.exports = model;
