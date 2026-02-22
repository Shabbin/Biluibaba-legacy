import { ReactNode } from "react";
import type { AxiosError } from "axios";

// ============================================================
// User & Auth Types
// ============================================================

export interface UserShipping {
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  zip?: string;
  profilePic?: string;
  avatar?: string;
  role?: string;
  shipping?: UserShipping;
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
  id: string;
  productId?: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  discount: number;
  category?: string;
  subCategory?: string;
  pet?: string;
  size?: string;
  quantity?: number;
  status: boolean;
  images: ProductImage[];
  sizes?: ProductSize[];
  vendor?: string;
  vendorId?: ProductVendor;
  review?: number;
  totalReview?: number;
  ratings?: number;
  totalRatings?: number;
  totalReviews?: number;
  ratingBreakdown?: RatingBreakdown;
  reviews?: ProductReview[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductImage {
  id?: string;
  _id?: string;
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
  [key: string]: number;
}

export interface ProductReview {
  _id?: string;
  userId: ReviewUser;
  rating: number;
  comment: string;
  date: string;
}

export interface ReviewUser {
  _id: string;
  name: string;
  avatar?: string;
}

export interface ProductVendor {
  _id: string;
  name: string;
  logo?: string;
  storeName?: string;
}

// ============================================================
// Cart Types
// ============================================================

export interface CartItem {
  id: string;
  name: string;
  src: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: number;
  slug?: string;
  discount?: number;
  category?: string;
  description?: string;
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
  size?: number | string;
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
  adoptionId?: string;
  name: string;
  pet?: string;
  species?: string;
  breed: string;
  age: string;
  gender: string;
  size?: string;
  color?: string[];
  location: string;
  description?: string;
  vaccinated?: string | boolean;
  neutered?: string | boolean;
  phoneNumber?: string;
  images: ProductImage[];
  status?: string;
  user?: string | AdoptionPoster;
  postedBy?: AdoptionPoster;
  addedOn?: string;
  comments?: AdoptionComment[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AdoptionPoster {
  _id?: string;
  name: string;
  profilePic?: string;
  avatar?: string;
  memberSince?: string;
}

export interface AdoptionComment {
  id: number;
  name: string;
  comment: string;
  profilePic: string;
  uploaded: string;
}

export interface AdoptionFilters {
  age: string;
  species: string;
  breed: string;
  gender: string;
  size: string;
  vaccinated: string;
  color: string;
  location: string;
  neutered: string;
}

export interface AdoptionOrder {
  _id: string;
  adoption: string | Adoption;
  user: string | User;
  name: string;
  phoneNumber: string;
  region: string;
  address: string;
  whyAdopt: string;
  petProof: string;
  takeCareOfPet: string;
  totalAmount: number;
  status: string;
  paymentStatus?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================
// Vet Types
// ============================================================

export interface Vet {
  _id: string;
  name: string;
  designation?: string;
  degree?: string;
  bio?: string;
  profilePic?: string;
  profilePicture?: string;
  star?: number;
  ratings?: number;
  totalReviews?: number;
  reviews?: VetReview[];
  price?: number;
  type?: string;
  slots?: VetSlots;
  verified?: boolean;
  license?: string | boolean;
  specializations?: string[];
  specializedZone?: SpecializedZone[];
  experience?: number;
  education?: string;
  location?: string;
  hospital?: string;
  address?: VetAddress;
  appointments?: VetAppointments;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpecializedZone {
  pet: string;
  concerns: string[];
}

export interface VetAddress {
  fullAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface VetAppointments {
  slots: VetSlots;
  online?: VetAppointmentFee;
  physical?: VetAppointmentFee;
  homeService?: VetAppointmentFee;
  emergency?: VetAppointmentFee;
  vaccine?: VetAppointmentFee;
  [key: string]: VetSlots | VetAppointmentFee | undefined;
}

export interface VetAppointmentFee {
  fee: number;
}

export interface VetSlots {
  [day: string]: {
    availableSlots: string[];
  };
}

export interface VetReview {
  _id?: string;
  id?: number;
  userId: ReviewUser;
  rating: number;
  comment: string;
  date: string;
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

/** Vet data stored in localStorage for appointment booking */
export interface VetAppointmentLocal {
  id: string;
  name: string;
  date: string;
  time: string;
  totalAmount: number;
  type: string;
  address?: string;
  hospital?: string;
  profilePicture?: string;
  degree?: string;
}

/** Pet filter stored in localStorage */
export interface PetFilter {
  species: string;
  concerns: string[];
}

// ============================================================
// Booking Types (for my-account)
// ============================================================

export interface VetBooking {
  _id: string;
  bookingNumber?: string;
  id?: string;
  serviceType?: string;
  vet: {
    _id?: string;
    name: string;
    profilePicture: string;
  };
  total?: number;
  amount?: number;
  createdAt?: string;
}

// ============================================================
// Order Types
// ============================================================

export interface Order {
  _id: string;
  orderId?: string;
  orderNumber?: string;
  user: string | User;
  products?: OrderProduct[];
  total?: number;
  totalAmount?: number;
  totalPrice?: number;
  shippingAddress?: ShippingAddress;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderProduct {
  _id?: string;
  product?: string | Product;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  image?: string;
}

export interface ShippingAddress {
  name?: string;
  email?: string;
  phone?: string;
  address: string;
  city?: string;
  zip?: string;
  state?: string;
  area?: string;
  district?: string;
  postcode?: string;
}

// ============================================================
// API Response Types
// ============================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  [key: string]: unknown;
}

export interface ProductsResponse extends ApiResponse {
  products: Product[];
  total?: number;
  totalProducts?: number;
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
  adoptionCount?: number;
}

export interface OrdersResponse extends ApiResponse {
  orders: Order[];
}

export interface SiteSettingsResponse extends ApiResponse {
  site: SiteSettings;
}

export interface AuthLoginResponse extends ApiResponse {
  url?: string;
}

export interface AuthRegisterResponse extends ApiResponse {
  url?: string;
}

export interface OrderCreateResponse extends ApiResponse {
  url?: string;
  orderId?: string;
}

export interface BestDealsResponse extends ApiResponse {
  products: Array<{ id: Product }>;
  totalProducts: number;
  duration: number | string;
}

export interface SearchProductsResponse extends ApiResponse {
  products: Product[];
}

export interface VetCheckoutResponse extends ApiResponse {
  url: string;
}

export interface AdoptionCheckoutResponse extends ApiResponse {
  url: string;
}

export interface BookingsResponse extends ApiResponse {
  bookings: VetBooking[];
}

// ============================================================
// Site Settings Types
// ============================================================

export interface PopularCategory {
  _id: string;
  category: string;
  categorySlug: string;
  image: string;
}

export interface BrandSpotlight {
  name?: string;
  path: string;
  filename?: string;
}

export interface SiteSettings {
  product_landing_slider: ProductImage[];
  popular_product_category: PopularCategory[];
  featured_product: Product | null;
  product_banner_one: ProductImage;
  product_brands_in_spotlight: BrandSpotlight[];
  // [FUTURE] Non-ecommerce site settings — make required when enabling vet & adoption features
  vet_landing_slider?: (ProductImage | string)[];
  vet_banner_one?: ProductImage;
  vet_grid_banners?: ProductImage[];
  adoption_banner_one?: ProductImage;
  adoption_banner_two?: ProductImage;
  featured_adoptions?: Adoption[];
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
  value: string | number;
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

// ============================================================
// Demo Data Types
// ============================================================

export interface DemoProduct {
  id: number;
  name: string;
  slug: string;
  category: string;
  size: string;
  description: string;
  newPrice: number;
  oldPrice: number;
  src: string;
}

export interface DemoAdoption {
  id: number;
  pet: string;
  name: string;
  location: string;
  addedOn: string;
  pic: string;
  breed: string;
  gender: string;
  age: string;
  size: string;
  postedBy: {
    name: string;
    profilePic: string;
    memberSince: string;
  };
  vaccinated: string;
  neutered: string;
  description: string;
  comments: DemoComment[];
}

export interface DemoComment {
  id: number;
  name: string;
  comment: string;
  profilePic: string;
  uploaded: string;
}

export interface DemoVet {
  id: number;
  name: string;
  designation: string;
  star: number;
  license: boolean;
  profilePic: string;
  description: string;
  species: string[];
  areaOfInterest: string[];
  licenses: string[];
  availableSlots: string[];
  fee: number;
  totalFee: number;
  reviews: DemoVetReview[];
}

export interface DemoVetReview {
  id: number;
  name: string;
  date: string;
  review: string;
  profilePic: string;
}

// ============================================================
// Breed Data Types
// ============================================================

export interface BreedCategory {
  name: string;
  breeds: string[];
}

// ============================================================
// Subscription Types
// ============================================================

export interface SubscriptionPackage {
  name: string;
  price: number;
  features: string[];
}

// ============================================================
// Checkout Types
// ============================================================

export interface CheckoutCartItem {
  id?: string;
  quantity: number;
  price: number;
  name: string;
  src: string;
  size?: number;
  slug?: string;
}

// ============================================================
// Axios Error Helpers
// ============================================================

export interface ApiErrorResponse {
  error?: string;
  message?: string;
}

export type ApiAxiosError = AxiosError<ApiErrorResponse>;

// ============================================================
// Vet Category for landing page
// ============================================================

export interface VetCategoryItem {
  label: string;
  src: string;
  link: string;
}

// ============================================================
// Pet Product Data Types (for product listing)
// ============================================================

export interface PetProductCategory {
  name: string;
  value: string[];
  src: string;
}

export interface PetProductEntry {
  name: string;
  src: string;
  categories: PetProductCategory[];
}

export interface PetProductData {
  pets: PetProductEntry[];
}

// ============================================================
// Service Card Types
// ============================================================

export interface ServiceCard {
  img: string;
  title: string;
  link: string;
}

// ============================================================
// Time Left Types
// ============================================================

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
