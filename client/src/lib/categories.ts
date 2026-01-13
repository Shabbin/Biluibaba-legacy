// Type definitions for product categories
export interface CategoryItem {
  name: string;
  slug: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  items: CategoryItem[];
}

export interface ProductCategoryData {
  name: string;
  slug: string;
  categories: SubCategory[];
}

// Product categories data with full type safety
export const productCategories: ProductCategoryData[] = [
  {
    name: 'Cat',
    slug: 'cat',
    categories: [
      {
        name: 'Food and Treats',
        slug: 'food-and-treats',
        items: [
          { name: 'Dry Food', slug: 'dry-food' },
          { name: 'Wet Food', slug: 'wet-food' },
          { name: 'Treats', slug: 'treats' },
          { name: 'Supplements', slug: 'supplements' },
          { name: 'Snacks', slug: 'snacks' },
          { name: 'Chew Toys (Edible)', slug: 'chew-toys-edible' },
        ],
      },
      {
        name: 'Health and Wellness',
        slug: 'health-and-wellness',
        items: [
          { name: 'Vitamins & Supplements', slug: 'vitamins-and-supplements' },
          { name: 'Flea & Tick Prevention', slug: 'flea-and-tick-prevention' },
          { name: 'Dewormers', slug: 'dewormers' },
          { name: 'Joint Care', slug: 'joint-care' },
          { name: 'Immune Boosters', slug: 'immune-boosters' },
        ],
      },
      {
        name: 'Grooming and Hygiene',
        slug: 'grooming-and-hygiene',
        items: [
          { name: 'Shampoos & Conditioners', slug: 'shampoos-and-conditioners' },
          { name: 'Brushes & Combs', slug: 'brushes-and-combs' },
          { name: 'Nail Clippers', slug: 'nail-clippers' },
          { name: 'Tooth Care', slug: 'tooth-care' },
          { name: 'Grooming Kits', slug: 'grooming-kits' },
          { name: 'Litter & Litter Boxes', slug: 'litter-and-litter-boxes' },
        ],
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        items: [
          { name: 'Collars & Leashes', slug: 'collars-and-leashes' },
          { name: 'Bowls & Feeders', slug: 'bowls-and-feeders' },
          { name: 'ID Tags', slug: 'id-tags' },
          { name: 'Pet Clothing', slug: 'pet-clothing' },
          { name: 'Cat Trees & Scratching Posts', slug: 'cat-trees-and-scratching-posts' },
        ],
      },
      {
        name: 'Toys',
        slug: 'toys',
        items: [
          { name: 'Interactive Toys', slug: 'interactive-toys' },
          { name: 'Chew Toys', slug: 'chew-toys' },
          { name: 'Plush Toys', slug: 'plush-toys' },
          { name: 'Balls & Fetch Toys', slug: 'balls-and-fetch-toys' },
          { name: 'Catnip Toys', slug: 'catnip-toys' },
        ],
      },
      {
        name: 'Training and Behavior',
        slug: 'training-and-behavior',
        items: [
          { name: 'Training Pads', slug: 'training-pads' },
          { name: 'Cat Training Aids', slug: 'cat-training-aids' },
          { name: 'Litter Training Products', slug: 'litter-training-products' },
        ],
      },
      {
        name: 'Furniture',
        slug: 'furniture',
        items: [
          { name: 'Cat Beds & Mats', slug: 'cat-beds-and-mats' },
          { name: 'Cat Trees & Scratching Posts', slug: 'cat-trees-and-scratching-posts' },
          { name: 'Pet Sofas', slug: 'pet-sofas' },
        ],
      },
      {
        name: 'Travel and Outdoor',
        slug: 'travel-and-outdoor',
        items: [
          { name: 'Travel Bags & Carriers', slug: 'travel-bags-and-carriers' },
          { name: 'Outdoor Cat Harnesses', slug: 'outdoor-cat-harnesses' },
          { name: 'Pet Strollers', slug: 'pet-strollers' },
        ],
      },
    ],
  },
  {
    name: 'Dog',
    slug: 'dog',
    categories: [
      {
        name: 'Food and Treats',
        slug: 'food-and-treats',
        items: [
          { name: 'Dry Food', slug: 'dry-food' },
          { name: 'Wet Food', slug: 'wet-food' },
          { name: 'Treats', slug: 'treats' },
          { name: 'Supplement Powders', slug: 'supplement-powders' },
          { name: 'Snacks', slug: 'snacks' },
          { name: 'Chew Bones', slug: 'chew-bones' },
        ],
      },
      {
        name: 'Health and Wellness',
        slug: 'health-and-wellness',
        items: [
          { name: 'Vitamins & Supplements', slug: 'vitamins-and-supplements' },
          { name: 'Flea & Tick Prevention', slug: 'flea-and-tick-prevention' },
          { name: 'Dewormers', slug: 'dewormers' },
          { name: 'Joint Care', slug: 'joint-care' },
          { name: 'Skin & Coat Health', slug: 'skin-and-coat-health' },
        ],
      },
      {
        name: 'Grooming and Hygiene',
        slug: 'grooming-and-hygiene',
        items: [
          { name: 'Shampoos & Conditioners', slug: 'shampoos-and-conditioners' },
          { name: 'Brushes & Combs', slug: 'brushes-and-combs' },
          { name: 'Nail Clippers', slug: 'nail-clippers' },
          { name: 'Tooth Care', slug: 'tooth-care' },
          { name: 'Grooming Kits', slug: 'grooming-kits' },
        ],
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        items: [
          { name: 'Collars & Leashes', slug: 'collars-and-leashes' },
          { name: 'Harnesses', slug: 'harnesses' },
          { name: 'Bowls & Feeders', slug: 'bowls-and-feeders' },
          { name: 'Dog Jackets & Boots', slug: 'dogs-jackets-and-boots' },
          { name: 'ID Tags', slug: 'id-tags' },
          { name: 'Cooling Mats', slug: 'cooling-mats' },
        ],
      },
      {
        name: 'Toys',
        slug: 'toys',
        items: [
          { name: 'Interactive Toys', slug: 'interactive-toys' },
          { name: 'Chew Toys', slug: 'chew-toys' },
          { name: 'Plush Toys', slug: 'plush-toys' },
          { name: 'Fetch Toys', slug: 'fetch-toys' },
          { name: 'Puzzle Toys', slug: 'puzzle-toys' },
        ],
      },
      {
        name: 'Training',
        slug: 'training',
        items: [
          { name: 'Training Pads', slug: 'training-pads' },
          { name: 'Training Collars', slug: 'training-collars' },
          { name: 'Clickers', slug: 'clickers' },
          { name: 'Treat Pouches', slug: 'treat-pouches' },
        ],
      },
      {
        name: 'Travel',
        slug: 'travel',
        items: [
          { name: 'Carriers', slug: 'carriers' },
          { name: 'Car Seats', slug: 'car-seats' },
          { name: 'Travel Bowls', slug: 'travel-bowls' },
          { name: 'Pet Strollers', slug: 'pet-strollers' },
        ],
      },
    ],
  },
  {
    name: 'Bird',
    slug: 'bird',
    categories: [
      {
        name: 'Food',
        slug: 'food',
        items: [
          { name: 'Seeds', slug: 'seeds' },
          { name: 'Pellets', slug: 'pellets' },
          { name: 'Treats', slug: 'treats' },
          { name: 'Supplements', slug: 'supplements' },
        ],
      },
      {
        name: 'Cages & Accessories',
        slug: 'cages-and-accessories',
        items: [
          { name: 'Bird Cages', slug: 'bird-cages' },
          { name: 'Perches', slug: 'perches' },
          { name: 'Feeders', slug: 'feeders' },
          { name: 'Waterers', slug: 'waterers' },
          { name: 'Cage Covers', slug: 'cage-covers' },
        ],
      },
      {
        name: 'Toys',
        slug: 'toys',
        items: [
          { name: 'Swings', slug: 'swings' },
          { name: 'Mirrors', slug: 'mirrors' },
          { name: 'Bells', slug: 'bells' },
          { name: 'Chew Toys', slug: 'chew-toys' },
        ],
      },
      {
        name: 'Health',
        slug: 'health',
        items: [
          { name: 'Vitamins', slug: 'vitamins' },
          { name: 'Mite Treatment', slug: 'mite-treatment' },
          { name: 'First Aid', slug: 'first-aid' },
        ],
      },
    ],
  },
  {
    name: 'Fish',
    slug: 'fish',
    categories: [
      {
        name: 'Food',
        slug: 'food',
        items: [
          { name: 'Flakes', slug: 'flakes' },
          { name: 'Pellets', slug: 'pellets' },
          { name: 'Frozen Food', slug: 'frozen-food' },
          { name: 'Live Food', slug: 'live-food' },
        ],
      },
      {
        name: 'Tanks & Aquariums',
        slug: 'tanks-and-aquariums',
        items: [
          { name: 'Fish Tanks', slug: 'fish-tanks' },
          { name: 'Aquarium Stands', slug: 'aquarium-stands' },
          { name: 'Tank Covers', slug: 'tank-covers' },
        ],
      },
      {
        name: 'Equipment',
        slug: 'equipment',
        items: [
          { name: 'Filters', slug: 'filters' },
          { name: 'Heaters', slug: 'heaters' },
          { name: 'Air Pumps', slug: 'air-pumps' },
          { name: 'Lighting', slug: 'lighting' },
          { name: 'Thermometers', slug: 'thermometers' },
        ],
      },
      {
        name: 'Decorations',
        slug: 'decorations',
        items: [
          { name: 'Plants', slug: 'plants' },
          { name: 'Gravel & Substrate', slug: 'gravel-and-substrate' },
          { name: 'Ornaments', slug: 'ornaments' },
          { name: 'Backgrounds', slug: 'backgrounds' },
        ],
      },
      {
        name: 'Water Care',
        slug: 'water-care',
        items: [
          { name: 'Water Conditioners', slug: 'water-conditioners' },
          { name: 'Test Kits', slug: 'test-kits' },
          { name: 'Algae Control', slug: 'algae-control' },
        ],
      },
    ],
  },
  {
    name: 'Rabbit',
    slug: 'rabbit',
    categories: [
      {
        name: 'Food',
        slug: 'food',
        items: [
          { name: 'Hay', slug: 'hay' },
          { name: 'Pellets', slug: 'pellets' },
          { name: 'Treats', slug: 'treats' },
          { name: 'Fresh Food', slug: 'fresh-food' },
        ],
      },
      {
        name: 'Housing',
        slug: 'housing',
        items: [
          { name: 'Hutches', slug: 'hutches' },
          { name: 'Indoor Cages', slug: 'indoor-cages' },
          { name: 'Playpens', slug: 'playpens' },
          { name: 'Bedding', slug: 'bedding' },
        ],
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        items: [
          { name: 'Water Bottles', slug: 'water-bottles' },
          { name: 'Food Bowls', slug: 'food-bowls' },
          { name: 'Hay Racks', slug: 'hay-racks' },
          { name: 'Litter Boxes', slug: 'litter-boxes' },
        ],
      },
      {
        name: 'Toys',
        slug: 'toys',
        items: [
          { name: 'Chew Toys', slug: 'chew-toys' },
          { name: 'Tunnels', slug: 'tunnels' },
          { name: 'Balls', slug: 'balls' },
        ],
      },
      {
        name: 'Health',
        slug: 'health',
        items: [
          { name: 'Vitamins', slug: 'vitamins' },
          { name: 'Grooming Supplies', slug: 'grooming-supplies' },
          { name: 'Nail Clippers', slug: 'nail-clippers' },
        ],
      },
    ],
  },
];

// Helper function to find category by slug
export const findCategoryBySlug = (slug: string): ProductCategoryData | undefined => {
  return productCategories.find((cat) => cat.slug === slug);
};

// Helper function to find subcategory
export const findSubCategory = (
  petSlug: string,
  categorySlug: string
): SubCategory | undefined => {
  const pet = findCategoryBySlug(petSlug);
  return pet?.categories.find((cat) => cat.slug === categorySlug);
};

// Helper function to get all category slugs
export const getAllCategorySlugs = (): string[] => {
  return productCategories.map((cat) => cat.slug);
};
