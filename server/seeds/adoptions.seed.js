const mongoose = require("mongoose");
const Adoptions = require("../models/adoption.model");

const petTypes = ["dog", "cat", "bird", "rabbit"];

const dogBreeds = [
  "Golden Retriever", "Labrador", "German Shepherd", "Husky", "Pomeranian",
  "Beagle", "Bulldog", "Poodle", "Rottweiler", "Dachshund", "Mixed Breed"
];

const catBreeds = [
  "Persian", "Siamese", "Bengal", "Maine Coon", "British Shorthair",
  "Ragdoll", "Sphynx", "Scottish Fold", "Domestic Shorthair", "Mixed Breed"
];

const birdTypes = [
  "Parrot", "Cockatiel", "Parakeet", "Lovebird", "Canary",
  "Finch", "Macaw", "Cockatoo", "Conure", "Budgie"
];

const rabbitBreeds = [
  "Holland Lop", "Netherland Dwarf", "Lionhead", "Mini Rex", "Dutch",
  "Flemish Giant", "Angora", "English Lop", "Californian", "Mixed Breed"
];

const colors = [
  "White", "Black", "Brown", "Golden", "Gray", "Spotted", "Tabby",
  "Cream", "Orange", "Calico", "Tri-color", "Mixed"
];

const genders = ["male", "female"];

const temperaments = [
  "Friendly and playful",
  "Calm and gentle",
  "Energetic and active",
  "Shy but loving",
  "Independent",
  "Affectionate and cuddly",
  "Playful and curious",
  "Quiet and reserved",
  "Social and outgoing",
  "Loyal and protective"
];

const healthStatuses = [
  "Healthy, all vaccinations up to date",
  "Excellent health, neutered/spayed",
  "Good health, requires regular grooming",
  "Very healthy, recently checked by vet",
  "Perfect health, microchipped",
];

const reasons = [
  "Owner moving abroad",
  "Family allergies",
  "Found as stray, rescued",
  "Unable to care due to work",
  "Downsizing home",
  "Rescued from shelter",
  "Owner's health issues",
  "Too many pets at home",
];

function getBreedByType(type) {
  switch (type) {
    case "dog": return dogBreeds[Math.floor(Math.random() * dogBreeds.length)];
    case "cat": return catBreeds[Math.floor(Math.random() * catBreeds.length)];
    case "bird": return birdTypes[Math.floor(Math.random() * birdTypes.length)];
    case "rabbit": return rabbitBreeds[Math.floor(Math.random() * rabbitBreeds.length)];
    default: return "Unknown";
  }
}

function generatePetName(type) {
  const dogNames = ["Max", "Buddy", "Charlie", "Rocky", "Duke", "Bailey", "Cooper", "Tucker"];
  const catNames = ["Whiskers", "Mittens", "Shadow", "Luna", "Simba", "Bella", "Oliver", "Cleo"];
  const birdNames = ["Tweety", "Kiwi", "Mango", "Sunny", "Coco", "Rio", "Sky", "Pepper"];
  const rabbitNames = ["Thumper", "Cotton", "Snowball", "Bunny", "Fluffy", "Hoppy", "Peter", "Daisy"];

  switch (type) {
    case "dog": return dogNames[Math.floor(Math.random() * dogNames.length)];
    case "cat": return catNames[Math.floor(Math.random() * catNames.length)];
    case "bird": return birdNames[Math.floor(Math.random() * birdNames.length)];
    case "rabbit": return rabbitNames[Math.floor(Math.random() * rabbitNames.length)];
    default: return "Pet";
  }
}

function generateAge(type) {
  // Age in months
  const minAge = type === "bird" ? 2 : 3;
  const maxAge = type === "bird" ? 60 : 120;
  return Math.floor(Math.random() * (maxAge - minAge) + minAge);
}

function generateAdoptions(count = 40) {
  const adoptions = [];

  for (let i = 0; i < count; i++) {
    const petType = petTypes[Math.floor(Math.random() * petTypes.length)];
    const breed = getBreedByType(petType);
    const name = generatePetName(petType);
    const ageInMonths = generateAge(petType);
    const gender = genders[Math.floor(Math.random() * genders.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const temperament = temperaments[Math.floor(Math.random() * temperaments.length)];
    const healthStatus = healthStatuses[Math.floor(Math.random() * healthStatuses.length)];
    const reason = reasons[Math.floor(Math.random() * reasons.length)];

    const ageYears = Math.floor(ageInMonths / 12);
    const remainingMonths = ageInMonths % 12;
    const ageString = ageYears > 0 
      ? `${ageYears} year${ageYears > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
      : `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;

    const isAdopted = Math.random() > 0.6; // 40% already adopted
    const views = Math.floor(Math.random() * 500) + 50;

    adoptions.push({
      petType,
      breed,
      name,
      age: ageString,
      ageInMonths,
      gender,
      color,
      size: petType === "dog" ? ["Small", "Medium", "Large"][Math.floor(Math.random() * 3)] : 
            petType === "rabbit" ? ["Small", "Medium"][Math.floor(Math.random() * 2)] : "Small",
      temperament,
      healthStatus,
      vaccinated: Math.random() > 0.3, // 70% vaccinated
      neutered: Math.random() > 0.5,
      description: `${name} is a lovely ${ageString} old ${gender} ${breed}. ${temperament}. ${healthStatus}. Looking for a caring forever home!`,
      reason,
      location: {
        area: ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur"][Math.floor(Math.random() * 6)],
        city: "Dhaka",
        country: "Bangladesh",
      },
      contactName: `Pet Owner ${i + 1}`,
      contactPhone: `017${Math.floor(10000000 + Math.random() * 90000000)}`,
      contactEmail: `adopter${i + 1}@example.com`,
      images: [
        `/uploads/adoptions/${petType}-${(i % 8) + 1}.jpg`,
        `/uploads/adoptions/${petType}-${(i % 8) + 2}.jpg`,
      ],
      adoptionFee: petType === "dog" ? Math.random() > 0.5 ? 0 : Math.floor(Math.random() * 3000) + 1000 :
                    petType === "cat" ? Math.random() > 0.6 ? 0 : Math.floor(Math.random() * 2000) + 500 :
                    0, // Birds and rabbits usually free
      status: isAdopted ? "adopted" : "available",
      featured: Math.random() > 0.8,
      urgent: Math.random() > 0.85,
      views,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Last 60 days
    });
  }

  return adoptions;
}

async function seedAdoptions() {
  try {
    console.log("🌱 Starting adoption seeding...");

    // Clear existing adoptions
    await Adoptions.deleteMany({});
    console.log("✅ Cleared existing adoptions");

    // Generate and insert adoptions
    const adoptions = generateAdoptions(40);
    await Adoptions.insertMany(adoptions);

    console.log(`✅ Successfully seeded ${adoptions.length} pet adoptions!`);
    console.log(`   - Dogs: ${adoptions.filter(a => a.petType === "dog").length}`);
    console.log(`   - Cats: ${adoptions.filter(a => a.petType === "cat").length}`);
    console.log(`   - Birds: ${adoptions.filter(a => a.petType === "bird").length}`);
    console.log(`   - Rabbits: ${adoptions.filter(a => a.petType === "rabbit").length}`);
    console.log(`   - Available: ${adoptions.filter(a => a.status === "available").length}`);
    console.log(`   - Adopted: ${adoptions.filter(a => a.status === "adopted").length}`);

  } catch (error) {
    console.error("❌ Error seeding adoptions:", error);
    throw error;
  }
}

module.exports = { seedAdoptions, generateAdoptions };
