const mongoose = require("mongoose");

const AdoptionOrderSchema = new mongoose.Schema(
  {
    orderId: String,
    status: String,
    payment: Number,
    name: String,
    phoneNumber: String,
    area: String,
    address: String,
    whyAdopt: String,
    petProof: String,
    paymentSessionKey: String,
    takeCareOfPet: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
    adoptionId: { type: mongoose.Schema.Types.ObjectId, ref: "AdoptionData" },
  },
  { collection: "adoption-order-data", timestamps: true }
);

const model = mongoose.model("AdoptionOrderData", AdoptionOrderSchema);

module.exports = model;
