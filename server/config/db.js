const logger = require("coders-logger");
const mongoose = require("mongoose");

const ProductModel = require("../models/product.model");
const SiteSettings = require("../models/site-settings.model");

// Check if site settings are initialized
const initializeSiteSettings = async () => {
  try {
    logger.debug("Checking site settings...");
    let settings = await SiteSettings.findOne();

    if (!settings) {
      logger.alert("Initializing default site settings...");

      settings = new SiteSettings({
        product_landing_slider: [],
        popular_product_category: [],
        featured_product: null,
        product_banner_one: { filename: "", path: "" },
        product_brands_in_spotlight: [],
        vet_landing_slider: [],
        vet_banner_one: { filename: "", path: "" },
        vet_grid_banners: [],
        adoption_banner_one: { filename: "", path: "" },
        adoption_banner_two: { filename: "", path: "" },
        featured_adoptions: [],
        adoption_landing_banner: [],
        adoption_landing_banner_two: [],
        best_deals: {
          duration: 0, // Default duration in days
          products: [],
        },
      });

      await settings.save();
      logger.success("Default site settings initialized");
    } else {
      logger.success("Site settings already initialized");
    }
  } catch (error) {
    logger.error("Error initializing site settings", error);
  }
};

const connectDB = async () => {
  // Connect to MongoDB
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.MONGO_URI);
  logger.success("MongoDB Connected");

  // Initialize site settings
  await initializeSiteSettings();
};

module.exports = connectDB;
