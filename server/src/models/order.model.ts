import mongoose, { Schema, Model, Document, Types } from 'mongoose';

interface IOrderProduct {
  id: Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  vendor?: Types.ObjectId;
}

export interface IOrder extends Document {
  _id: Types.ObjectId;
  orderId: string;
  status: string;
  type?: string;
  products: IOrderProduct[];
  paymentMethod: string;
  paymentStatus: boolean;
  paymentSessionKey?: string;
  deliveryStatus?: string;
  deliveryTrackingCode?: string;
  deliveryConsignmentId?: string;
  totalAmount: number;
  userId: Types.ObjectId;
  shippingCost: number;
  name: string;
  phoneNumber: string;
  region?: string;
  area?: string;
  fullAddress: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderProductSchema = new Schema<IOrderProduct>(
  {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'ProductData',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: 'VendorData',
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
    type: String,
    products: {
      type: [OrderProductSchema],
      required: true,
      validate: {
        validator: (v: IOrderProduct[]) => v.length > 0,
        message: 'At least one product is required',
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: Boolean,
      default: false,
    },
    paymentSessionKey: String,
    deliveryStatus: {
      type: String,
      default: 'pending',
    },
    deliveryTrackingCode: String,
    deliveryConsignmentId: String,
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'UserData',
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    region: String,
    area: String,
    fullAddress: {
      type: String,
      required: true,
    },
    notes: String,
  },
  {
    collection: 'order-data',
    timestamps: true,
  }
);

// Post-save hook to update product order counts
OrderSchema.post('save', async function (document, next) {
  try {
    if (document.status === 'confirmed' || document.paymentStatus === true) {
      const Products = mongoose.model('ProductData');
      
      for (const product of document.products) {
        await Products.findByIdAndUpdate(
          product.id,
          { $inc: { orderCount: 1 } },
          { new: true }
        );
      }
    }
  } catch (error) {
    console.error('Error updating orderCount for products:', error);
  }
  next?.();
});

// Indexes
OrderSchema.index({ orderId: 1 });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.model<IOrder>('OrderData', OrderSchema);

export default Order;
