import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import ErrorResponse from '../utils/ErrorResponse';
import { generateRandomId } from '../utils/GenerateId';
import { createDeliveryRequest } from '../utils/Delivery';
import { sendEmail } from '../utils/SendMail';
import Order from '../models/order.model';
import Vendor from '../models/vendor.model';
import User from '../models/user.model';
import Product from '../models/product.model';
import { AuthenticatedRequest } from '../types';

// Load email templates
const loadTemplate = (templatePath: string): string => {
  try {
    return fs.readFileSync(path.join(__dirname, templatePath), 'utf-8');
  } catch {
    return '';
  }
};

const OrderPlacedCOD = loadTemplate('../../templates/order/order-placed-cod.hbs');
const OrderPlacedOnline = loadTemplate('../../templates/order/order-placed-online.hbs');
const invoiceTemplate = loadTemplate('../../templates/order/invoice.hbs');
const AdminNewOrder = loadTemplate('../../templates/admin/new-order.hbs');
const VendorNewOrder = loadTemplate('../../templates/vendor/new-order.hbs');

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  vendorId: string;
  price: number;
}

interface CreateOrderBody {
  totalAmount: number;
  product: OrderProduct[];
  shippingCost: number;
  name: string;
  phoneNumber: string;
  region: string;
  area: string;
  fullAddress: string;
  notes?: string;
  paymentMethod: 'Online' | 'COD';
}

/**
 * Add order to vendor's order list
 */
const addOrderToVendors = async (order: any): Promise<any[]> => {
  try {
    if (!order.products || !order.products.length || !order.orderId) {
      throw new Error('Invalid order data');
    }

    // Use a Set to track unique vendor IDs
    const uniqueVendorIds = new Set(
      order.products.map((product: any) => product.vendor.toString())
    );

    const updatePromises = Array.from(uniqueVendorIds).map(async (vendorId) => {
      const vendor = await Vendor.findById(vendorId);
      if (!vendor) {
        console.error(`Vendor with ID ${vendorId} not found`);
        return null;
      }

      // Only push if the orderId doesn't already exist
      if (!vendor.orderIDs.includes(order._id)) {
        return Vendor.findByIdAndUpdate(
          vendorId,
          { $push: { orderIDs: order._id } },
          { new: true, runValidators: true }
        );
      }
      return vendor;
    });

    const updatedVendors = await Promise.all(updatePromises);
    return updatedVendors.filter((vendor) => vendor !== null);
  } catch (error) {
    console.error('Error updating vendors:', (error as Error).message);
    throw error;
  }
};

/**
 * Create a product order
 * @route POST /api/order
 */
export const createProductOrder = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      totalAmount,
      product,
      shippingCost,
      name,
      phoneNumber,
      region,
      area,
      fullAddress,
      notes,
      paymentMethod,
    } = request.body as CreateOrderBody;

    // Check if all information is provided
    if (
      !totalAmount ||
      !product ||
      !shippingCost ||
      !name ||
      !phoneNumber ||
      !region ||
      !area ||
      !fullAddress
    ) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const products = product.map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      vendor: p.vendorId,
      price: p.price,
    }));

    const orderId = generateRandomId(20);

    const order = await Order.create({
      orderId,
      status: 'pending',
      products,
      totalAmount,
      userId: request.user!._id,
      shippingCost,
      name,
      phoneNumber,
      region,
      area,
      fullAddress,
      paymentMethod,
      paymentStatus: false,
      notes,
    });

    if (paymentMethod === 'Online') {
      // For production, integrate with payment gateway
      // const paymentResponse = await createPaymentRequest(...);
      // order.paymentSessionKey = paymentResponse.sessionkey;
      // await order.save();
      
      response.status(200).json({
        success: true,
        orderId: order.orderId,
        // url: paymentResponse.GatewayPageURL, // Uncomment for production
      });
    } else {
      // COD Order
      await addOrderToVendors(order);

      const message = handlebars.compile(OrderPlacedCOD)({
        orderId: order.orderId,
      });

      const adminMessage = handlebars.compile(AdminNewOrder)({
        order_id: order.orderId,
        cus_name: order.name,
        payment_status: order.paymentMethod,
        total_amount: order.totalAmount,
      });

      const vendorMessage = handlebars.compile(VendorNewOrder)({
        order_id: order.orderId,
        cus_name: order.name,
        payment_status: order.paymentMethod,
      });

      // Send email to customer
      await sendEmail({
        to: request.user!.email,
        subject: 'Order Confirmed - Cash on Delivery',
        message,
      });

      // Send email to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: 'New Order Received - Cash on Delivery',
        message: adminMessage,
      });

      // Update product quantities and send emails to vendors
      for (const productItem of order.products) {
        const p = await Product.findById(productItem.id);
        if (p) {
          p.quantity = p.quantity - productItem.quantity;
          if (p.quantity <= 0) {
            p.quantity = 0;
            p.status = false;
          }
          await p.save();
        }

        const vendor = await Vendor.findById(productItem.vendor);
        if (vendor) {
          await sendEmail({
            to: vendor.email,
            subject: 'New Order Received - Cash on Delivery',
            message: vendorMessage,
          });
        }
      }

      // Create delivery request
      const deliveryResponse = await createDeliveryRequest({
        invoice: order.orderId,
        recipient_name: order.name,
        recipient_phone: order.phoneNumber,
        recipient_address: order.fullAddress,
        cod_amount: order.totalAmount,
      });

      if (deliveryResponse.status === 200) {
        order.deliveryConsignmentId = deliveryResponse.consignment.consignment_id;
        order.deliveryStatus = deliveryResponse.consignment.status;
        order.deliveryTrackingCode = deliveryResponse.consignment.tracking_code;
      }

      await order.save();

      await User.findByIdAndUpdate(order.userId, {
        $push: { invoiceIDs: order._id },
      });

      response.status(200).json({
        success: true,
        orderId: order.orderId,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Validate product order payment
 * @route POST /api/order/validate
 */
export const validateProductOrder = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, val_id, value_a } = request.body;

    console.log('Payment status:', status);

    if (status === 'VALID') {
      // For production, validate with payment gateway
      // const paymentResponse = await validatePayment(val_id);

      const order = await Order.findOne({ orderId: value_a }).populate(
        'userId',
        'email'
      ) as any;

      if (!order) {
        return next(new ErrorResponse('No order found', 404));
      }

      await User.findByIdAndUpdate(order.userId, {
        $push: { invoiceIDs: order._id },
      });

      order.paymentStatus = true;
      order.paymentSessionKey = val_id;

      const deliveryResponse = await createDeliveryRequest({
        invoice: order.orderId,
        recipient_name: order.name,
        recipient_phone: order.phoneNumber,
        recipient_address: order.fullAddress,
        cod_amount: 0,
      });

      if (deliveryResponse.status === 200) {
        order.deliveryConsignmentId = deliveryResponse.consignment.consignment_id;
        order.deliveryStatus = deliveryResponse.consignment.status;
        order.deliveryTrackingCode = deliveryResponse.consignment.tracking_code;
      }

      await order.save();
      await addOrderToVendors(order);

      // Send emails
      const message = handlebars.compile(OrderPlacedOnline)({
        orderId: order.orderId,
        amount: order.totalAmount,
      });

      await sendEmail({
        to: order.userId.email,
        subject: 'Order Confirmed - Payment Received',
        message,
      });

      // Update product quantities
      for (const product of order.products) {
        const p = await Product.findById(product.id);
        if (p) {
          p.quantity = p.quantity - product.quantity;
          if (p.quantity <= 0) {
            p.quantity = 0;
            p.status = false;
          }
          await p.save();
        }
      }

      response.status(200).redirect(
        `${process.env.FRONTEND_URL}/products/order?status=success&orderId=${order.orderId}`
      );
    } else {
      await Order.findOneAndDelete({ orderId: value_a });
      response.status(200).redirect(`${process.env.FRONTEND_URL}/products/order?status=failed`);
    }
  } catch (error) {
    next(error);
  }
};
