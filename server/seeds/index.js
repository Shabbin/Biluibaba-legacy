#!/usr/bin/env node

/**
 * Master Seed Script for Biluibaba
 * 
 * This script populates the database with comprehensive dummy data for testing.
 * 
 * Usage:
 *   npm run seed              - Seed all data
 *   npm run seed:clean        - Clear all data and reseed
 *   npm run seed:products     - Seed only products
 *   npm run seed:users        - Seed only users
 *   npm run seed:orders       - Seed only orders
 *   npm run seed:vets         - Seed only vets
 *   npm run seed:adoptions    - Seed only adoptions
 */

const mongoose = require("mongoose");
const connectDB = require("../config/db");

// Import seeders
const { seedProducts } = require("./products.seed");
const { seedUsers } = require("./users.seed");
const { seedOrders } = require("./orders.seed");
const { seedVets } = require("./vets.seed");
const { seedAdoptions } = require("./adoptions.seed");

// Import models for cleaning
const Products = require("../models/product.model");
const Users = require("../models/user.model");
const Orders = require("../models/order.model");
const Vets = require("../models/vet.model");
const Adoptions = require("../models/adoption.model");

const args = process.argv.slice(2);
const command = args[0] || "all";

async function cleanDatabase() {
  console.log("\n🧹 Cleaning database...");
  
  await Products.deleteMany({});
  await Users.deleteMany({ authType: "email" }); // Keep any admin or special accounts
  await Orders.deleteMany({});
  await Vets.deleteMany({});
  await Adoptions.deleteMany({});
  
  console.log("✅ Database cleaned successfully!\n");
}

async function seedAll() {
  try {
    console.log("\n🌱 Starting complete database seeding...\n");
    console.log("=" .repeat(50));

    // Seed in order of dependencies
    await seedUsers();
    console.log();
    
    await seedProducts();
    console.log();
    
    await seedOrders(); // Depends on users and products
    console.log();
    
    await seedVets();
    console.log();
    
    await seedAdoptions();
    console.log();

    console.log("=" .repeat(50));
    console.log("\n🎉 All data seeded successfully!\n");
    
    console.log("📝 Test Credentials:");
    console.log("   Customer: test@biluibaba.com / password123");
    console.log("   Vet: dr.ashraf.mahmud@biluibaba.com / vet123");
    console.log();

  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  }
}

async function main() {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB\n");

    switch (command) {
      case "clean":
        await cleanDatabase();
        await seedAll();
        break;

      case "products":
        await seedProducts();
        break;

      case "users":
        await seedUsers();
        break;

      case "orders":
        await seedOrders();
        break;

      case "vets":
        await seedVets();
        break;

      case "adoptions":
        await seedAdoptions();
        break;

      case "all":
      default:
        await seedAll();
        break;
    }

    console.log("\n✅ Seeding completed successfully!");
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

// Run main function
main();
