// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  authType: 'email' | 'google' | 'facebook';
  verified: boolean;
  avatar?: string;
  promotionalEmails: boolean;
  package: 'free' | 'premium' | 'enterprise';
  packageExpire?: number;
  shipping?: ShippingAddress;
  wishlist: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  state?: string;
  area?: string;
  district?: string;
  postcode?: string;
  address?: string;
}

export interface WishlistItem {
  _id: string;
  productId: string;
  createdAt: string;
}

// Product Types
export interface Product {
  _id: string;
  productId: string;
  status: boolean;
  slug: string;
  categories: ProductCategory[];
  name: string;
  images: ProductImage[];
  price: number;
  size?: number;
  discount?: number;
  quantity: number;
  description: string;
  orderCount?: string;
  featured: boolean;
  vendorId: string | Vendor;
  vendorName?: string;
  ratings: number;
  totalRatings: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdown;
  reviews: Review[];
  tags: string[];
  views: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  parent: string;
  category: string;
  sub: string;
}

export interface ProductImage {
  filename: string;
  path: string;
}

export interface RatingBreakdown {
  excellent: number;
  veryGood: number;
  good: number;
  average: number;
  poor: number;
}

export interface Review {
  _id?: string;
  userId: string | User;
  comment: string;
  rating: number;
  date: string;
}

// Vendor Types
export interface Vendor {
  _id: string;
  storeName: string;
  avatar?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Vet Types
export interface Vet {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalRatings: number;
  avatar?: string;
  available: boolean;
  location?: VetLocation;
  schedule?: VetSchedule[];
  createdAt: string;
  updatedAt: string;
}

export interface VetLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface VetSchedule {
  day: string;
  slots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Adoption Types
export interface Adoption {
  _id: string;
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color: string;
  description: string;
  images: ProductImage[];
  location: AdoptionLocation;
  vaccinated: boolean;
  neutered: boolean;
  healthStatus: string;
  temperament: string[];
  requirements: string[];
  adoptionFee: number;
  status: 'available' | 'pending' | 'adopted';
  userId: string | User;
  createdAt: string;
  updatedAt: string;
}

export interface AdoptionLocation {
  city: string;
  state: string;
  country: string;
}

// Order Types
export interface Order {
  _id: string;
  orderId: string;
  userId: string | User;
  products: OrderProduct[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string | Product;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Appointment Types
export interface Appointment {
  _id: string;
  user: string | User;
  vet: string | Vet;
  type: 'consultation' | 'checkup' | 'vaccination' | 'surgery' | 'grooming';
  date: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  fee: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

// Site Settings Types
export interface SiteSettings {
  product_landing_slider: SliderItem[];
  popular_product_category: CategoryItem[];
  featured_product: string | null;
  product_banner_one: BannerImage;
  product_brands_in_spotlight: BrandItem[];
  vet_landing_slider: SliderItem[];
  vet_banner_one: BannerImage;
  vet_grid_banners: BannerImage[];
  adoption_banner_one: BannerImage;
  adoption_banner_two: BannerImage;
  featured_adoptions: string[];
  adoption_landing_banner: BannerImage[];
  adoption_landing_banner_two: BannerImage[];
  best_deals: BestDeals;
}

export interface SliderItem {
  _id: string;
  filename: string;
  path: string;
  link?: string;
}

export interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: ProductImage;
}

export interface BannerImage {
  filename: string;
  path: string;
}

export interface BrandItem {
  _id: string;
  name: string;
  logo: string;
}

export interface BestDeals {
  duration: number;
  products: BestDealProduct[];
}

export interface BestDealProduct {
  id: string | Product;
  discountPercentage?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Auth Context Types
export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  fetchUserData: () => Promise<void>;
  isLoading?: boolean;
}

// Location Types
export interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  success?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
