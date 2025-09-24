const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    product_landing_slider: {
      type: [{ filename: String, path: String }],
      default: [], // Default to an empty array
    },
    popular_product_category: {
      type: [{ category: String, categorySlug: String, image: String }],
      default: [], // Default to an empty array
    },
    featured_product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductData",
      default: null,
    },
    product_banner_one: {
      type: { filename: String, path: String },
      default: { filename: "", path: "" }, // Default to empty values
    },
    product_brands_in_spotlight: {
      type: [{ name: String, slug: String, path: String }],
      default: [],
    },
    vet_landing_slider: {
      type: [{ filename: String, path: String }],
      default: [],
    },
    vet_banner_one: {
      type: { filename: String, path: String },
      default: { filename: "", path: "" },
    },
    vet_grid_banners: {
      type: [{ filename: String, path: String }],
      default: [],
    },
    adoption_banner_one: {
      type: { filename: String, path: String },
      default: { filename: "", path: "" },
    },
    adoption_banner_two: {
      type: { filename: String, path: String },
      default: { filename: "", path: "" },
    },
    featured_adoptions: {
      type: [{ id: String, name: String, description: String, slug: String }],
      default: [],
    },
    adoption_landing_banner: {
      type: [{ filename: String, path: String }],
      default: [],
    },
    adoption_landing_banner_two: {
      type: [{ filename: String, path: String }],
      default: [],
    },
    best_deals: {
      duration: { type: Number, default: 0 },
      products: [
        {
          id: { type: mongoose.Schema.Types.ObjectId, ref: "ProductData" },
        },
      ],
    },
  },
  { collection: "site-settings", timestamps: true }
);

const model = mongoose.model("SiteSettings", SiteSettingsSchema);

module.exports = model;
