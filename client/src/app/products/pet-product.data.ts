interface CategoryData {
  name: string;
  value: string[];
  src: string;
}

interface PetDataItem {
  name: string;
  src: string;
  categories: CategoryData[];
}

interface PetDataExport {
  pets: PetDataItem[];
}

const PetData: PetDataExport = {
  pets: [
    {
      name: 'cat',
      src: '/banners/cat.png',
      categories: [
        {
          name: 'Food and Treats',
          value: ['cat', 'food-and-treats'],
          src: '/banners/cat/accessories.png',
        },
        {
          name: 'Health and Wellness',
          value: ['cat', 'health-and-wellness'],
          src: '/banners/cat/bowl.png',
        },
        {
          name: 'Grooming and Hygiene',
          value: ['cat', 'grooming-and-hygiene'],
          src: '/banners/cat/clothing.png',
        },
        {
          name: 'Accessories',
          value: ['cat', 'accessories'],
          src: '/banners/cat/dry-food.png',
        },
        {
          name: 'Toys',
          value: ['cat', 'toys'],
          src: '/banners/cat/furnitures.png',
        },
        {
          name: 'Training and Behavior',
          value: ['cat', 'training-and-behavior'],
          src: '/banners/cat/grooming.png',
        },
        {
          name: 'Furniture',
          value: ['cat', 'furtinure'],
          src: '/banners/cat/health-and-awareness.png',
        },
        {
          name: 'Travel and Outdoor',
          value: ['cat', 'travel-and-outdoor'],
          src: '/banners/cat/toys.png',
        },
        {
          name: 'Specialized Products',
          value: ['cat', 'specialized-products'],
          src: '/banners/cat/treats.png',
        },
        {
          name: 'Cleaning and Maintenance',
          value: ['cat', 'cleaning-and-maintenance'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Safety and Security',
          value: ['cat', 'safety-and-security'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Small Pet Supplies',
          value: ['cat', 'small-pet-supplies'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Gift Sets and Seasonal',
          value: ['cat', 'gift-sets-and-security'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Eco-Friendly and Sustainable',
          value: ['cat', 'eco-friendly-and-sustainable'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Clothing and Apparel',
          value: ['cat', 'clothing-and-apparel'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Luxury and Premium',
          value: ['cat', 'luxury-and-premium'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Adoption and Breeding',
          value: ['cat', 'adoption-and-breeding'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Behavioral Products',
          value: ['cat', 'behavioral-products'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Seasonal and Holiday Products',
          value: ['cat', 'seasonal-and-holiday-products'],
          src: '/banners/cat/wet-food.png',
        },
        {
          name: 'Photography',
          value: ['cat', 'photography'],
          src: '/banners/cat/wet-food.png',
        },
      ],
    },
    {
      name: 'dog',
      src: '/banners/dog.png',
      categories: [
        {
          name: 'Food and Treats',
          value: ['dog', 'food-and-treats'],
          src: '/banners/dog/accessories.png',
        },
        {
          name: 'Health and Wellness',
          value: ['dog', 'health-and-wellness'],
          src: '/banners/dog/bowl.png',
        },
        {
          name: 'Grooming and Hygience',
          value: ['dog', 'grooming-and-hygience'],
          src: '/banners/dog/clothing.png',
        },
        {
          name: 'Accessories',
          value: ['dog', 'accessories'],
          src: '/banners/dog/dry-food.png',
        },
        {
          name: 'Toys',
          value: ['dog', 'toys'],
          src: '/banners/dog/furnitures.png',
        },
        {
          name: 'Training and Behavior',
          value: ['dog', 'training-and-behavior'],
          src: '/banners/dog/grooming.png',
        },
        {
          name: 'Furniture',
          value: ['dog', 'furniture'],
          src: '/banners/dog/toys.png',
        },
        {
          name: 'Travel and Outdoor',
          value: ['dog', 'travel-and-outdoor'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Specialized Products',
          value: ['dog', 'specialized-products'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Cleaning and Maintenance',
          value: ['dog', 'cleaning-and-maintenance'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Safety and Security',
          value: ['dog', 'safety-and-security'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Gift Sets and Seasonal',
          value: ['dog', 'gifts-sets-and-seasonal'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Eco-Friendly and Sustainable',
          value: ['dog', 'eco-friendly-and-sustainable'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Clothing and Apparel',
          value: ['dog', 'clothing-and-apparel'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Luxury and Premium',
          value: ['dog', 'luxury-and-premium'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Adoption and Breeding',
          value: ['dog', 'adoption-and-breeding'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Behavioral Products',
          value: ['dog', 'behavioral-products'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Seasonal and Holiday Products',
          value: ['dog', 'seasonal-and-holiday-products'],
          src: '/banners/dog/wet-food.png',
        },
        {
          name: 'Photography',
          value: ['dog', 'photography'],
          src: '/banners/dog/wet-food.png',
        },
      ],
    },
    {
      name: 'bird',
      src: '/banners/bird.png',
      categories: [
        {
          name: 'Food and Treats',
          value: ['bird', 'food-and-treats'],
          src: '/banners/bird/accessories.png',
        },
        {
          name: 'Health and Wellness',
          value: ['bird', 'health-and-wellness'],
          src: '/banners/bird/bowl.png',
        },
        {
          name: 'Grooming and Hygience',
          value: ['bird', 'grooming-and-hygience'],
          src: '/banners/bird/clothing.png',
        },
        {
          name: 'Accessories',
          value: ['bird', 'accessories'],
          src: '/banners/bird/dry-food.png',
        },
        {
          name: 'Toys',
          value: ['bird', 'toys'],
          src: '/banners/bird/furnitures.png',
        },
        {
          name: 'Training and Behavior',
          value: ['bird', 'training-and-behavior'],
          src: '/banners/bird/grooming.png',
        },
        {
          name: 'Furniture',
          value: ['bird', 'furniture'],
          src: '/banners/bird/toys.png',
        },
        {
          name: 'Travel and Outdoor',
          value: ['bird', 'travel-and-outdoor'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Specialized Products',
          value: ['bird', 'specialized-products'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Cleaning and Maintenance',
          value: ['bird', 'cleaning-and-maintenance'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Safety and Security',
          value: ['bird', 'safety-and-security'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Gift Sets and Seasonal',
          value: ['bird', 'gifts-sets-and-seasonal'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Eco-Friendly and Sustainable',
          value: ['bird', 'eco-friendly-and-sustainable'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Clothing and Apparel',
          value: ['bird', 'clothing-and-apparel'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Luxury and Premium',
          value: ['bird', 'luxury-and-premium'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Adoption and Breeding',
          value: ['bird', 'adoption-and-breeding'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Behavioral Products',
          value: ['bird', 'behavioral-products'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Seasonal and Holiday Products',
          value: ['bird', 'seasonal-and-holiday-products'],
          src: '/banners/bird/wet-food.png',
        },
        {
          name: 'Photography',
          value: ['bird', 'photography'],
          src: '/banners/bird/wet-food.png',
        },
      ],
    },
    {
      name: 'rabbit',
      src: '/banners/rabbit.png',
      categories: [
        {
          name: 'Accessories',
          value: ['rabbit', 'accessories'],
          src: '/banners/rabbit/accessories.png',
        },
        {
          name: 'Bowl',
          value: ['rabbit', 'accessories', 'feeling-bowls'],
          src: '/banners/rabbit/bowl.png',
        },
        {
          name: 'Clothing',
          value: ['rabbit', 'clothing-and-apparel'],
          src: '/banners/rabbit/clothing.png',
        },
        {
          name: 'Grooming',
          value: ['rabbit', 'grooming-and-hygiene'],
          src: '/banners/rabbit/grooming.png',
        },
        {
          name: 'Pet Travel and Outdoor',
          value: ['rabbit', 'toys'],
          src: '/banners/rabbit/pet-travel-and-outdoor.png',
        },
        {
          name: 'Furniture',
          value: ['rabbit', 'furniture'],
          src: '/banners/rabbit/furniture.png',
        },
        {
          name: 'Food',
          value: ['rabbit', 'food-and-treats'],
          src: '/banners/rabbit/food.png',
        },
      ],
    },
    {
      name: 'fish',
      src: '/banners/fish.png',
      categories: [
        {
          name: 'Accessories',
          value: ['fish', 'accessories'],
          src: '/banners/rabbit/accessories.png',
        },
        {
          name: 'Bowl',
          value: ['fish', 'accessories', 'feeling-bowls'],
          src: '/banners/rabbit/bowl.png',
        },
        {
          name: 'Clothing',
          value: ['fish', 'clothing-and-apparel'],
          src: '/banners/rabbit/clothing.png',
        },
        {
          name: 'Grooming',
          value: ['fish', 'grooming-and-hygiene'],
          src: '/banners/rabbit/grooming.png',
        },
        {
          name: 'Pet Travel and Outdoor',
          value: ['fish', 'toys'],
          src: '/banners/rabbit/pet-travel-and-outdoor.png',
        },
        {
          name: 'Furniture',
          value: ['fish', 'furniture'],
          src: '/banners/rabbit/furniture.png',
        },
        {
          name: 'Food',
          value: ['fish', 'food-and-treats'],
          src: '/banners/rabbit/food.png',
        },
      ],
    },
  ],
};

export default PetData;
