import { ReactNode } from "react";

// ============================================================
// User & Auth Types
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
  profilePic?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserData: () => Promise<void>;
}

// ============================================================
// Product Types
// ============================================================

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  category?: string;
  subCategory?: string;
  pet?: string;
  status: boolean;
  images: ProductImage[];
  sizes?: ProductSize[];
  vendor?: string;
  review?: number;
  totalReview?: number;
  ratings?: number;
  totalRatings?: number;
  ratingBreakdown?: RatingBreakdown;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id: string;
  filename: string;
  path: string;
}

export interface ProductSize {
  size: string;
  price: number;
  stock: number;
}

export interface RatingBreakdown {
  excellent: number;
  veryGood: number;
  good: number;
  average: number;
  poor: number;
}

// ============================================================
// Cart Types
// ============================================================

export interface CartItem {
  id: string;
  name: string;
  src: string;
  price: number;
  quantity: number;
  size?: number;
}

// ============================================================
// Wishlist Types
// ============================================================

export interface WishlistItem {
  name: string;
  slug: string;
  src: string;
  price: number;
  discount: number;
}

export interface AdoptionWishlistItem {
  id: string;
  name: string;
  pet: string;
  pic: string;
  location: string;
  age: string;
  gender: string;
  breed: string;
}

// ============================================================
// Adoption Types
// ============================================================

export interface Adoption {
  _id: string;
  name: string;
  pet: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  description?: string;
  vaccinated?: boolean;
  images: ProductImage[];
  status?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Vet Types
// ============================================================

export interface Vet {
  _id: string;
  name: string;
  designation: string;
  bio?: string;
  profilePic?: string;
  star: number;
  reviews: number;
  price: number;
  type: string;
  slots: VetSlots;
  verified?: boolean;
  specializations?: string[];
  experience?: number;
  education?: string;
  location?: string;
}

export interface VetSlots {
  [day: string]: {
    availableSlots: string[];
  };
}

export interface VetAppointment {
  _id: string;
  vet: string | Vet;
  user: string | User;
  date: string;
  slot: string;
  pet: string;
  concern: string;
  sex: string;
  breed: string;
  birthdate: string;
  reason: string;
  status: string;
  paymentSessionKey?: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Order Types
// ============================================================

export interface Order {
  _id: string;
  orderId: string;
  user: string | User;
  products: OrderProduct[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderProduct {
  product: string | Product;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface ProductsResponse extends ApiResponse {
  products: Product[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ProductResponse extends ApiResponse {
  product: Product;
}

export interface VetsResponse extends ApiResponse {
  vets: Vet[];
}

export interface AdoptionsResponse extends ApiResponse {
  adoptions: Adoption[];
}

export interface OrdersResponse extends ApiResponse {
  orders: Order[];
}

// ============================================================
// Site Settings Types
// ============================================================

export interface SiteSettings {
  product_landing_slider: ProductImage[];
  popular_product_category: string[];
  featured_product: Product | null;
  product_banner_one: ProductImage;
  product_brands_in_spotlight: ProductImage[];
  vet_landing_slider: ProductImage[];
  vet_banner_one: ProductImage;
  vet_grid_banners: ProductImage[];
  adoption_banner_one: ProductImage;
  adoption_banner_two: ProductImage;
  featured_adoptions: Adoption[];
}

// ============================================================
// Category Types
// ============================================================

export interface CategoryItem {
  name: string;
  slug: string;
}

export interface SubCategory {
  name: string;
  slug: string;
  items: CategoryItem[];
}

export interface ProductCategory {
  name: string;
  slug: string;
  categories: SubCategory[];
}

// ============================================================
// Component Prop Types
// ============================================================

export interface ChildrenProps {
  children: ReactNode;
}

export interface SelectOption {
  value: string;
  text: string;
}

export interface FAQItem {
  question: string;
  answer: string | ReactNode;
}

// ============================================================
// Location Types
// ============================================================

export interface LocationData {
  value: string;
  text: string;
}
