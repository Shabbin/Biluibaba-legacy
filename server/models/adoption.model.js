const mongoose = require("mongoose");

const AdoptionSchema = new mongoose.Schema(
  {
    adoptionId: String,
    status: String,
    name: String,
    species: String,
    gender: String,
    age: String,
    breed: String,
    size: String,
    vaccinated: String,
    neutered: String,
    color: [String],
    location: String,
    description: String,
    phoneNumber: String,
    images: [{ filename: String, path: String }],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "UserData" },
  },
  { collection: "adoption-data", timestamps: true }
);

const model = mongoose.model("AdoptionData", AdoptionSchema);

module.exports = model;
