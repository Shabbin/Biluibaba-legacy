const mongoose = require("mongoose");
const Products = require("../models/product.model");

const productCategories = {
  dog: ["Dog Food", "Dog Toys", "Dog Accessories", "Dog Health", "Dog Treats"],
  cat: ["Cat Food", "Cat Litter", "Cat Toys", "Cat Accessories", "Cat Health"],
  bird: ["Bird Food", "Bird Cages", "Bird Toys", "Bird Accessories"],
  rabbit: ["Rabbit Food", "Rabbit Hay", "Rabbit Toys", "Rabbit Accessories"],
  fish: ["Fish Food", "Aquarium", "Fish Accessories"],
};

const productNames = {
  "Dog Food": [
    "Premium Chicken & Rice Dog Food",
    "Grain-Free Salmon Formula",
    "Puppy Growth Complete Nutrition",
    "Senior Dog Healthy Aging Formula",
    "Active Dog High Protein Blend",
    "Sensitive Stomach Easy Digest",
    "Weight Management Light Formula",
    "Organic Lamb & Vegetables",
    "Small Breed Adult Formula",
    "Large Breed Joint Support",
  ],
  "Dog Toys": [
    "Durable Rope Tug Toy",
    "Interactive Puzzle Ball",
    "Squeaky Plush Toy Set",
    "Flying Disc Frisbee",
    "Chew Bone Natural Rubber",
    "Tennis Ball Pack of 6",
    "Treat Dispensing Ball",
    "Plush Squeaky Duck",
    "Kong Classic Red",
    "Rope Knot Bundle",
  ],
  "Dog Accessories": [
    "Adjustable Nylon Collar",
    "Retractable Leash 5M",
    "Stainless Steel Food Bowl",
    "Waterproof Dog Bed",
    "Travel Water Bottle",
    "Dog Harness No-Pull",
    "ID Tag Personalized",
    "Grooming Brush Set",
    "Car Seat Cover Protector",
    "Paw Cleaner Portable",
  ],
  "Dog Health": [
    "Multivitamin Chewable Tablets",
    "Joint Support Glucosamine",
    "Probiotic Digestive Aid",
    "Flea & Tick Prevention",
    "Omega-3 Fish Oil Capsules",
    "Dental Chews for Fresh Breath",
    "Hip & Joint Soft Chews",
    "Skin & Coat Supplement",
    "Calming Aid Treats",
    "Deworming Tablets",
  ],
  "Dog Treats": [
    "Chicken Jerky Strips",
    "Peanut Butter Biscuits",
    "Training Treat Bites",
    "Dental Sticks Pack",
    "Freeze-Dried Liver Treats",
    "Sweet Potato Chews",
    "Beef Flavor Bones",
    "Salmon Skin Rolls",
    "Puppy Training Rewards",
    "Natural Dental Chews",
  ],
  "Cat Food": [
    "Premium Tuna & Salmon Wet Food",
    "Indoor Cat Hairball Control",
    "Kitten Complete Nutrition",
    "Senior Cat Healthy Aging",
    "Grain-Free Turkey Formula",
    "Weight Control Light Recipe",
    "Sensitive Stomach Formula",
    "Chicken & Liver Pate",
    "Mixed Grill Variety Pack",
    "Seafood Delight Chunks",
  ],
  "Cat Litter": [
    "Clumping Clay Litter 10kg",
    "Natural Pine Pellets",
    "Silica Crystal Litter",
    "Odor Control Multi-Cat",
    "Unscented Clumping Formula",
    "Lightweight Easy Scoop",
    "Biodegradable Corn Litter",
    "Activated Charcoal Formula",
    "Lavender Scented Litter",
    "Low Dust Natural Clay",
  ],
  "Cat Toys": [
    "Interactive Feather Wand",
    "Catnip Mouse Set of 6",
    "Laser Pointer Automatic",
    "Rolling Ball Track Tower",
    "Scratching Post with Ball",
    "Plush Fish Kicker Toy",
    "Spring Toy Pack",
    "Interactive Turntable",
    "Tunnel Play Tube",
    "Catnip Stuffed Banana",
  ],
  "Cat Accessories": [
    "Breakaway Safety Collar",
    "Stainless Steel Bowl Set",
    "Self-Grooming Brush",
    "Cozy Cat Cave Bed",
    "Scratching Mat Sisal",
    "Cat Carrier Hard Shell",
    "Nail Clipper Professional",
    "Water Fountain Automatic",
    "Window Perch Suction",
    "Litter Mat Trapper",
  ],
  "Cat Health": [
    "Hairball Control Gel",
    "Vitamin Supplement Paste",
    "Flea Treatment Spot-On",
    "Dental Care Toothpaste",
    "Calming Pheromone Spray",
    "Urinary Health Support",
    "Joint Care for Seniors",
    "Probiotic Powder",
    "Dewormer Tablets",
    "Eye & Ear Wipes",
  ],
  "Bird Food": [
    "Parakeet Seed Mix Premium",
    "Parrot Pellets Complete",
    "Canary Song Food Blend",
    "Cockatiel Fruit & Nut Mix",
    "Finch Staple Seed Mix",
    "Lovebird Nutritional Pellets",
    "Budgie Veggie Mix",
    "Macaw Tropical Blend",
    "Wild Bird Seed Mix",
    "Millet Spray Natural",
  ],
  "Bird Cages": [
    "Large Flight Cage 80cm",
    "Parakeet Home with Stand",
    "Travel Carrier Portable",
    "Breeder Cage with Divider",
    "Corner Cage Space Saver",
    "Dome Top Victorian Style",
    "Play Top Activity Cage",
    "Small Bird Starter Kit",
    "Double Deck Large Aviary",
    "Hanging Cage Outdoor",
  ],
  "Bird Toys": [
    "Swing with Bell Set",
    "Ladder Climbing Toy",
    "Chewing Block Natural Wood",
    "Mirror with Perch",
    "Foraging Ball Puzzle",
    "Rope Perch Colorful",
    "Bell Cluster Toy",
    "Coconut Shell Hideout",
    "Acrylic Ball with Seeds",
    "Hanging Chew Rings",
  ],
  "Bird Accessories": [
    "Stainless Food Cup",
    "Water Dispenser Automatic",
    "Cuttlebone Calcium Supplement",
    "Perch Variety Pack",
    "Cage Cover Night Blanket",
    "Seed Catcher Guard",
    "Mineral Block with Holder",
    "Bath House Spa",
    "Feeding Station Detachable",
    "Cage Cleaning Brush Set",
  ],
  "Rabbit Food": [
    "Timothy Hay Pellets Adult",
    "Young Rabbit Growth Formula",
    "Veggie Mix Dehydrated",
    "Alfalfa Pellets for Babies",
    "Grain-Free Herbal Blend",
    "Senior Rabbit Easy Digest",
    "Fruit & Herb Treats Mix",
    "Complete Nutrition Pellets",
    "Organic Garden Vegetable",
    "High Fiber Maintenance",
  ],
  "Rabbit Hay": [
    "Timothy Hay 1st Cut 1kg",
    "Orchard Grass Premium",
    "Alfalfa Hay for Young Rabbits",
    "Meadow Hay Mix Natural",
    "Oat Hay Sweet Treat",
    "Timothy 2nd Cut Soft",
    "Botanical Hay with Herbs",
    "Organic Timothy Hay",
    "Compressed Hay Bale",
    "Mixed Grass Hay Bundle",
  ],
  "Rabbit Toys": [
    "Willow Ball Natural Chew",
    "Tunnel Play Tube",
    "Hanging Chew Toy Set",
    "Grass Mat Play Area",
    "Wooden Block Tower",
    "Apple Wood Sticks Bundle",
    "Sisal Rope Toy",
    "Carrot Chew Toy",
    "Activity Cube Puzzle",
    "Seagrass Ball Pack",
  ],
  "Rabbit Accessories": [
    "Hay Feeder Rack Wall Mount",
    "Ceramic Food Bowl Heavy",
    "Water Bottle No Drip",
    "Grooming Comb Soft Brush",
    "Litter Box Corner Style",
    "Hideaway House Wooden",
    "Nail Clipper Small Animal",
    "Carrier Travel Bag",
    "Playpen Foldable",
    "Resting Mat Soft Fleece",
  ],
  "Fish Food": [
    "Tropical Flakes Premium",
    "Goldfish Pellets Floating",
    "Betta Fish Micro Pellets",
    "Algae Wafers for Bottom Feeders",
    "Freeze-Dried Bloodworms",
    "Cichlid Color Enhancing",
    "Koi Pond Sticks",
    "Shrimp Pellets Sinking",
    "Tropical Granules Mixed",
    "Spirulina Flakes Veggie",
  ],
  "Aquarium": [
    "Glass Tank 50L Starter Kit",
    "LED Light Hood 60cm",
    "Filter System 100L/h",
    "Aquarium Heater 100W",
    "Air Pump with Tubing",
    "Gravel Natural Mixed 5kg",
    "Artificial Plants Decoration",
    "Background Poster Ocean",
    "Siphon Gravel Cleaner",
    "Test Kit pH & Ammonia",
  ],
  "Fish Accessories": [
    "Net Fine Mesh 15cm",
    "Thermometer Floating",
    "Algae Scraper Magnetic",
    "Cave Hideout Ceramic",
    "Ornament Shipwreck",
    "Airline Tubing 3M",
    "Check Valve Air Pump",
    "Water Conditioner 250ml",
    "Feeding Ring Floating",
    "CO2 Diffuser for Plants",
  ],
};

const descriptions = [
  "High-quality product designed for your pet's health and happiness.",
  "Premium formula crafted with natural ingredients for optimal nutrition.",
  "Veterinarian recommended for daily use and long-term health benefits.",
  "Made with love and care to ensure your pet's wellbeing.",
  "Trusted by pet owners worldwide for exceptional quality.",
  "Specially formulated to meet your pet's unique dietary needs.",
  "Safe, durable, and designed to last through hours of play.",
  "Easy to use and maintain for busy pet parents.",
  "Scientifically developed to support your pet's health.",
  "Perfect for pets of all ages and activity levels.",
];

const brands = [
  "PetPro",
  "Happy Paws",
  "TailWaggers",
  "PetNature",
  "FurryFriends",
  "PawsomeLife",
  "VitaPet",
  "PureNutrition",
  "PetEssentials",
  "ComfortPet",
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function generateProducts() {
  const products = [];
  let productId = 1;

  for (const [animal, categories] of Object.entries(productCategories)) {
    for (const category of categories) {
      const names = productNames[category] || [];

      for (const name of names) {
        const price = Math.floor(Math.random() * 4000) + 200;
        const discount = Math.random() > 0.6 ? [5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 6)] : 0;
        const stock = Math.floor(Math.random() * 200) + 10;
        const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
        const reviews = Math.floor(Math.random() * 500) + 10;

        products.push({
          name,
          slug: generateSlug(name),
          description: getRandomElement(descriptions),
          price,
          discount,
          category,
          animalType: animal,
          brand: getRandomElement(brands),
          stock,
          rating: parseFloat(rating),
          reviews,
          images: [
            `/products/placeholder-${animal}-${productId % 10}.jpg`,
          ],
          featured: Math.random() > 0.85,
          bestSeller: Math.random() > 0.9,
          newArrival: Math.random() > 0.85,
          inStock: stock > 0,
        });

        productId++;
      }
    }
  }

  return products;
}

async function seedProducts() {
  try {
    console.log("🌱 Starting product seeding...");

    // Clear existing products
    await Products.deleteMany({});
    console.log("✅ Cleared existing products");

    // Generate and insert products
    const products = generateProducts();
    await Products.insertMany(products);

    console.log(`✅ Successfully seeded ${products.length} products!`);
    console.log(`   - Featured: ${products.filter(p => p.featured).length}`);
    console.log(`   - Best Sellers: ${products.filter(p => p.bestSeller).length}`);
    console.log(`   - New Arrivals: ${products.filter(p => p.newArrival).length}`);

  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
}

module.exports = { seedProducts, generateProducts };
