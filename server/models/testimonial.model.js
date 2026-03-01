const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      trim: true,
    },
    quote_title: {
      type: String,
      required: [true, "Quote title is required"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    image: {
      filename: { type: String, default: "" },
      path: { type: String, default: "" },
    },
    display_order: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { collection: "testimonials-data", timestamps: true }
);

module.exports = mongoose.model("TestimonialData", TestimonialSchema);
