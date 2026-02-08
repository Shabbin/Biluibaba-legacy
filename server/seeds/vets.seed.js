const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Vets = require("../models/vet.model");

const vetNames = [
  { firstName: "Dr. Ashraf", lastName: "Mahmud" },
  { firstName: "Dr. Nusrat", lastName: "Jahan" },
  { firstName: "Dr. Kamrul", lastName: "Hasan" },
  { firstName: "Dr. Sharmin", lastName: "Akter" },
  { firstName: "Dr. Tanvir", lastName: "Rahman" },
  { firstName: "Dr. Farzana", lastName: "Begum" },
  { firstName: "Dr. Imran", lastName: "Khan" },
  { firstName: "Dr. Rumana", lastName: "Islam" },
  { firstName: "Dr. Zahidul", lastName: "Karim" },
  { firstName: "Dr. Sabrina", lastName: "Ahmed" },
];

const specializations = [
  "General Veterinary Medicine",
  "Small Animal Surgery",
  "Emergency & Critical Care",
  "Exotic Animal Medicine",
  "Pet Nutrition & Wellness",
  "Dermatology",
  "Cardiology",
  "Oncology",
  "Orthopedic Surgery",
  "Internal Medicine",
];

const clinics = [
  "Pet Care Hospital",
  "Animal Wellness Center",
  "Happy Paws Clinic",
  "Dhaka Veterinary Clinic",
  "PetMed Hospital",
  "Advanced Pet Care",
  "City Vet Clinic",
  "Animal Health Center",
  "Pet Emergency Care",
  "Companion Animal Hospital",
];

const qualifications = [
  "DVM, Chittagong Veterinary College",
  "DVM, Bangladesh Agricultural University",
  "BVSc & AH, Sylhet Agricultural University",
  "DVM, Dhaka Veterinary College",
  "MVSc in Animal Surgery",
  "PhD in Veterinary Medicine",
];

const daysOfWeek = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday"];
const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];

function generateSchedule() {
  const schedule = {};

  // Each vet works 4-5 days a week
  const workDays = daysOfWeek
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 2) + 4);

  workDays.forEach(day => {
    const daySlots = timeSlots
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 4) + 3);

    schedule[day] = {
      available: true,
      availableSlots: daySlots.sort(),
    };
  });

  // Add unavailable days
  daysOfWeek.forEach(day => {
    if (!schedule[day]) {
      schedule[day] = {
        available: false,
        availableSlots: [],
      };
    }
  });

  return schedule;
}

async function generateVets(count = 15) {
  const vets = [];
  const hashedPassword = await bcrypt.hash("vet123", 10);

  for (let i = 0; i < count; i++) {
    const vetName = vetNames[i % vetNames.length];
    const email = `${vetName.firstName.toLowerCase().replace("dr. ", "")}.${vetName.lastName.toLowerCase()}@biluibaba.com`;
    const experience = Math.floor(Math.random() * 20) + 2;
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const reviews = Math.floor(Math.random() * 300) + 20;
    const consultationFee = [300, 400, 500, 600, 700, 800, 1000][Math.floor(Math.random() * 7)];

    vets.push({
      firstName: vetName.firstName,
      lastName: vetName.lastName,
      email,
      password: hashedPassword,
      phone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
      specialization: specializations[Math.floor(Math.random() * specializations.length)],
      qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
      experience,
      clinicName: clinics[Math.floor(Math.random() * clinics.length)],
      clinicAddress: {
        street: `Road ${Math.floor(Math.random() * 50) + 1}`,
        area: ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur"][Math.floor(Math.random() * 5)],
        city: "Dhaka",
        postalCode: `${Math.floor(1000 + Math.random() * 9000)}`,
        country: "Bangladesh",
      },
      rating: parseFloat(rating),
      reviews,
      consultationFee,
      schedule: generateSchedule(),
      verified: Math.random() > 0.2, // 80% verified
      profilePicture: `/uploads/profile/vet-${(i % 10) + 1}.jpg`,
      bio: `Experienced veterinarian specializing in ${specializations[Math.floor(Math.random() * specializations.length)].toLowerCase()} with ${experience} years of practice. Dedicated to providing compassionate care for your beloved pets.`,
      languages: ["Bengali", "English"],
    });
  }

  return vets;
}

async function seedVets() {
  try {
    console.log("🌱 Starting vet seeding...");

    // Clear existing vets
    await Vets.deleteMany({});
    console.log("✅ Cleared existing vets");

    // Generate and insert vets
    const vets = await generateVets(15);
    await Vets.insertMany(vets);

    console.log(`✅ Successfully seeded ${vets.length} vets!`);
    console.log(`   - Verified: ${vets.filter(v => v.verified).length}`);
    console.log(`   - Average experience: ${(vets.reduce((sum, v) => sum + v.experience, 0) / vets.length).toFixed(1)} years`);
    console.log(`   - Test vet login: dr.ashraf.mahmud@biluibaba.com / vet123`);

  } catch (error) {
    console.error("❌ Error seeding vets:", error);
    throw error;
  }
}

module.exports = { seedVets, generateVets };
