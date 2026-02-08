const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Users = require("../models/user.model");

const firstNames = [
  "Rahim", "Karim", "Sabbir", "Tanvir", "Shakib", "Mushfiq", "Tamim", "Mashrafe",
  "Fatima", "Ayesha", "Nusrat", "Rumana", "Sharmin", "Nasrin", "Sadia", "Farzana",
  "Arif", "Rafiq", "Mahbub", "Zahid", "Hasib", "Ashraf", "Imran", "Samir",
  "Sultana", "Jesmin", "Munira", "Rehana", "Jannatul", "Taslima", "Shireen", "Labiba"
];

const lastNames = [
  "Rahman", "Ahmed", "Islam", "Khan", "Hossain", "Ali", "Mahmud", "Hassan",
  "Chowdhury", "Akter", "Begum", "Khatun", "Miah", "Uddin", "Arefin", "Alam"
];

const locations = [
  { city: "Dhaka", areas: ["Dhanmondi", "Gulshan", "Banani", "Mirpur", "Uttara", "Mohammadpur"] },
  { city: "Chittagong", areas: ["Agrabad", "Nasirabad", "Panchlaish", "Khulshi"] },
  { city: "Sylhet", areas: ["Zindabazar", "Ambarkhana", "Shahjalal Upashahar"] },
  { city: "Rajshahi", areas: ["Shaheb Bazar", "Boalia", "Motihar"] },
];

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateEmail(firstName, lastName) {
  const domain = getRandomElement(["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"]);
  const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`;
  return `${username}@${domain}`;
}

function generatePhone() {
  const prefixes = ["017", "018", "019", "013", "014", "015", "016"];
  const prefix = getRandomElement(prefixes);
  const number = Math.floor(10000000 + Math.random() * 90000000);
  return `${prefix}${number}`;
}

function generateAddress() {
  const location = getRandomElement(locations);
  const area = getRandomElement(location.areas);
  const houseNo = Math.floor(Math.random() * 999) + 1;
  const roadNo = Math.floor(Math.random() * 50) + 1;

  return {
    street: `House ${houseNo}, Road ${roadNo}`,
    area,
    city: location.city,
    postalCode: `${Math.floor(1000 + Math.random() * 9000)}`,
    country: "Bangladesh",
  };
}

async function generateUsers(count = 50) {
  const users = [];
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    const email = generateEmail(firstName, lastName);

    users.push({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: generatePhone(),
      address: generateAddress(),
      verified: Math.random() > 0.2, // 80% verified
      profilePicture: `/uploads/profile/user-${(i % 10) + 1}.jpg`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    });
  }

  return users;
}

async function seedUsers() {
  try {
    console.log("🌱 Starting user seeding...");

    // Clear existing users (keep admin accounts)
    await Users.deleteMany({ role: { $ne: "admin" } });
    console.log("✅ Cleared existing users (kept admins)");

    // Create test user with known credentials
    const hashedPassword = await bcrypt.hash("password123", 10);
    const testUser = {
      firstName: "Test",
      lastName: "User",
      email: "test@biluibaba.com",
      password: hashedPassword,
      phone: "01712345678",
      address: generateAddress(),
      verified: true,
      profilePicture: "/uploads/profile/test-user.jpg",
    };

    await Users.create(testUser);
    console.log("✅ Created test user: test@biluibaba.com / password123");

    // Generate and insert random users
    const users = await generateUsers(49); // 49 + 1 test user = 50
    await Users.insertMany(users);

    console.log(`✅ Successfully seeded ${users.length + 1} users!`);
    console.log(`   - Verified: ${users.filter(u => u.verified).length + 1}`);
    console.log(`   - Unverified: ${users.filter(u => !u.verified).length}`);

  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

module.exports = { seedUsers, generateUsers };
