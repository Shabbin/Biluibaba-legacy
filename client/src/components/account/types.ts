export interface ShippingAddress {
  state: string;
  area: string;
  district: string;
  postcode: string;
  address: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  shipping?: ShippingAddress;
}

export interface OrderProduct {
  _id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber?: string;
  createdAt: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
  products: OrderProduct[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}