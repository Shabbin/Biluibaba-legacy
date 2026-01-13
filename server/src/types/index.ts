// Express types
import { Request, Response, NextFunction } from 'express';
import { Document, Types } from 'mongoose';

// Base User interface
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phoneNumber?: string;
  authType: 'email' | 'google' | 'facebook';
  verified: boolean;
  verificationCode?: string;
  avatar?: string;
  password?: string;
  promotionalEmails: boolean;
  package: 'free' | 'premium' | 'enterprise';
  packageExpire?: number;
  invoiceIDs: Types.ObjectId[];
  appointmentIDs: Types.ObjectId[];
  adoptionIDs: Types.ObjectId[];
  shipping?: IShippingAddress;
  wishlist: IWishlistItem[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
  getResetPasswordToken(): string;
}

export interface IShippingAddress {
  state?: string;
  area?: string;
  district?: string;
  postcode?: string;
  address?: string;
}

export interface IWishlistItem {
  _id?: Types.ObjectId;
  productId: string;
  createdAt: Date;
}

// Vendor interface
export interface IVendor extends Document {
  _id: Types.ObjectId;
  storeName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  avatar?: string;
  address?: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
}

// Vet interface
export interface IVet extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalRatings: number;
  avatar?: string;
  available: boolean;
  location?: IVetLocation;
  schedule?: IVetSchedule[];
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(password: string): Promise<boolean>;
  getSignedToken(): string;
}

export interface IVetLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IVetSchedule {
  day: string;
  slots: ITimeSlot[];
}

export interface ITimeSlot {
  start: string;
  end: string;
  available: boolean;
}

// Product interface
export interface IProduct extends Document {
  _id: Types.ObjectId;
  productId: string;
  status: boolean;
  slug: string;
  categories: IProductCategory[];
  name: string;
  images: IProductImage[];
  price: number;
  size?: number;
  discount?: number;
  quantity: number;
  description: string;
  orderCount?: string;
  featured: boolean;
  vendorId: Types.ObjectId;
  vendorName?: string;
  ratings: number;
  totalRatings: number;
  totalReviews: number;
  ratingBreakdown: IRatingBreakdown;
  reviews: IReview[];
  tags: string[];
  views: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductCategory {
  parent: string;
  category: string;
  sub: string;
}

export interface IProductImage {
  filename: string;
  path: string;
}

export interface IRatingBreakdown {
  excellent: number;
  veryGood: number;
  good: number;
  average: number;
  poor: number;
}

export interface IReview {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  comment: string;
  rating: number;
  date: Date;
}

// Order interface
export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderId: string;
  userId: Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderProduct {
  productId: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Appointment interface
export interface IAppointment extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  vet: Types.ObjectId;
  type: 'consultation' | 'checkup' | 'vaccination' | 'surgery' | 'grooming';
  date: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  fee: number;
  createdAt: Date;
  updatedAt: Date;
}

// Adoption interface
export interface IAdoption extends Document {
  _id: Types.ObjectId;
  petName: string;
  petType: string;
  breed: string;
  age: string;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
  color: string;
  description: string;
  images: IProductImage[];
  location: IAdoptionLocation;
  vaccinated: boolean;
  neutered: boolean;
  healthStatus: string;
  temperament: string[];
  requirements: string[];
  adoptionFee: number;
  status: 'available' | 'pending' | 'adopted';
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdoptionLocation {
  city: string;
  state: string;
  country: string;
}

// Site Settings interface
export interface ISiteSettings extends Document {
  _id: Types.ObjectId;
  product_landing_slider: ISliderItem[];
  popular_product_category: ICategoryItem[];
  featured_product: Types.ObjectId | null;
  product_banner_one: IBannerImage;
  product_brands_in_spotlight: IBrandItem[];
  vet_landing_slider: ISliderItem[];
  vet_banner_one: IBannerImage;
  vet_grid_banners: IBannerImage[];
  adoption_banner_one: IBannerImage;
  adoption_banner_two: IBannerImage;
  featured_adoptions: Types.ObjectId[];
  adoption_landing_banner: IBannerImage[];
  adoption_landing_banner_two: IBannerImage[];
  best_deals: IBestDeals;
}

export interface ISliderItem {
  _id?: Types.ObjectId;
  filename: string;
  path: string;
  link?: string;
}

export interface ICategoryItem {
  _id?: Types.ObjectId;
  name: string;
  slug: string;
  image?: IProductImage;
}

export interface IBannerImage {
  filename: string;
  path: string;
}

export interface IBrandItem {
  _id?: Types.ObjectId;
  name: string;
  logo: string;
}

export interface IBestDeals {
  duration: number;
  products: IBestDealProduct[];
}

export interface IBestDealProduct {
  id: Types.ObjectId;
  discountPercentage?: number;
}

// Extended Express Request types
export interface AuthenticatedRequest extends Request {
  user?: IUser;
  vendor?: IVendor;
  vet?: IVet;
}

// Controller function type
export type ControllerFunction = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

// Email options
export interface EmailOptions {
  to: string;
  subject: string;
  message: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  path?: string;
  content?: string | Buffer;
  contentType?: string;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  name: string;
  isVerified: boolean;
  avatar?: string;
  type?: string;
  package: string;
  packageExpire?: number;
}

// Environment variables
export interface ProcessEnv {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: string;
  DBURL: string;
  TOKEN_SECRET: string;
  TOKEN_EXPIRE: string;
  CORS_ORIGIN: string;
  APP_CORS_ORIGIN: string;
  ADMIN_CORS_ORIGIN: string;
  ROOM_CORS_ORIGIN: string;
  EMAIL_HOST: string;
  EMAIL_ADDRESS: string;
  EMAIL_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  OPENCAGE_API_KEY: string;
}
