import mongoose from 'mongoose';
import SiteSettings from '../models/site-settings.model.js';

/**
 * Initializes default site settings if not present
 */
const initializeSiteSettings = async (): Promise<void> => {
  try {
    console.log('Checking site settings...');
    let settings = await SiteSettings.findOne();

    if (!settings) {
      console.log('Initializing default site settings...');

      settings = new SiteSettings({
        product_landing_slider: [],
        popular_product_category: [],
        featured_product: null,
        product_banner_one: { filename: '', path: '' },
        product_brands_in_spotlight: [],
        vet_landing_slider: [],
        vet_banner_one: { filename: '', path: '' },
        vet_grid_banners: [],
        adoption_banner_one: { filename: '', path: '' },
        adoption_banner_two: { filename: '', path: '' },
        featured_adoptions: [],
        adoption_landing_banner: [],
        adoption_landing_banner_two: [],
        best_deals: {
          duration: 0,
          products: [],
        },
      });

      await settings.save();
      console.log('Default site settings initialized');
    } else {
      console.log('Site settings already initialized');
    }
  } catch (error) {
    console.error('Error initializing site settings:', error);
  }
};

/**
 * Connects to MongoDB database
 */
const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', false);

    const dbUrl = process.env.DBURL;
    if (!dbUrl) {
      throw new Error('DBURL environment variable is not defined');
    }

    await mongoose.connect(dbUrl);
    console.log('MongoDB Connected');

    // Initialize site settings after connection
    await initializeSiteSettings();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

export default connectDB;
