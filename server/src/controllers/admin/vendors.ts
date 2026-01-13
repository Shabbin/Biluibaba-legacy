import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import puppeteer from 'puppeteer';

import { ErrorResponse } from '../../utils/ErrorResponse';
import { sendEmail } from '../../utils/SendMail';
import { Vendor, Product, Order } from '../../models';

/**
 * Admin Vendors Controller
 * Handles vendor and order management for admins
 */

// Email templates
const OrderDispatched = fs.readFileSync(
  path.join(__dirname, '../../templates/order/order-dispatched.hbs'),
  'utf-8'
);
const DeliveryCOD = fs.readFileSync(
  path.join(__dirname, '../../templates/order/delivery-cod.hbs'),
  'utf-8'
);
const DeliveryOnline = fs.readFileSync(
  path.join(__dirname, '../../templates/order/delivery-prepaid.hbs'),
  'utf-8'
);
const OrderCancelled = fs.readFileSync(
  path.join(__dirname, '../../templates/order/order-cancelled.hbs'),
  'utf-8'
);
const OrderRefund = fs.readFileSync(
  path.join(__dirname, '../../templates/order/order-refund.hbs'),
  'utf-8'
);
const invoiceTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/order/invoice.hbs'),
  'utf-8'
);
const vendorApproved = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/approved.hbs'),
  'utf-8'
);
const vendorRejected = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/rejected.hbs'),
  'utf-8'
);
const productApproved = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/product-approved.hbs'),
  'utf-8'
);
const productRejected = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/product-rejected.hbs'),
  'utf-8'
);

interface IInvoiceItem {
  name: string;
  quantity: number;
  price: number;
  totalPrice: number;
}

interface IInvoiceData {
  invoiceNo: string;
  date: string;
  cus_name: string;
  address: string;
  phoneNumber: string;
  paymentMethod: string;
  items: IInvoiceItem[];
  subTotal: number;
  shipping: number;
  total: number;
  status: string;
}

/**
 * Get Vendors List
 * @route GET /api/admin/vendors
 * @access Private (Admin)
 */
export const getVendors = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { status, count } = request.query;

  if (!status || !count) {
    return next(new ErrorResponse('Missing information', 422));
  }

  const countNum = parseInt(count as string) || 0;

  const vendors = await Vendor.find({ status })
    .skip(countNum * 10)
    .limit(10)
    .sort('-createdAt');

  response.status(200).json({ success: true, vendors });
};

/**
 * Get Vendor By ID
 * @route GET /api/admin/vendors/:id
 * @access Private (Admin)
 */
export const getVendorById = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  if (!id) {
    return next(new ErrorResponse('Missing vendor ID', 422));
  }

  const vendor = await Vendor.findById(id);

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  response.status(200).json({ success: true, vendor });
};

/**
 * Update Vendor Status
 * @route PUT /api/admin/vendors/status
 * @access Private (Admin)
 */
export const updateVendorStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { status, vendorId } = request.body;

  if (!status || !vendorId) {
    return next(new ErrorResponse('Missing information', 422));
  }

  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    return next(new ErrorResponse('Vendor not found', 404));
  }

  vendor.status = status;
  await vendor.save();

  const message = handlebars.compile(
    status === 'approved' ? vendorApproved : vendorRejected
  )({
    vendor_name: vendor.name,
  });

  await sendEmail({
    to: vendor.email,
    subject:
      status === 'approved'
        ? 'Welcome Aboard – Vendor Account Approved'
        : 'Vendor Application Status – Not Approved',
    message,
  });

  response.status(200).json({ success: true, vendor });
};

/**
 * Get Products List
 * @route GET /api/admin/products
 * @access Private (Admin)
 */
export const getProducts = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { count, type } = request.query;
  const countNum = parseInt(count as string) || 0;

  let products: any[] = [];
  let totalProducts = 0;

  if (type === 'unpublished') {
    products = await Product.find({ status: false })
      .skip(countNum * 10)
      .limit(10)
      .sort('-createdAt')
      .populate('vendorId', 'name email phoneNumber');
    totalProducts = await Product.countDocuments({ status: false });
  } else if (type === 'published') {
    products = await Product.find({ status: true })
      .skip(countNum * 10)
      .limit(10)
      .sort('-createdAt')
      .populate('vendorId', 'name email phoneNumber');
    totalProducts = await Product.countDocuments({ status: true });
  }

  response.status(200).json({ success: true, products, totalProducts });
};

/**
 * Get Product By ID
 * @route GET /api/admin/products/:productId
 * @access Private (Admin)
 */
export const getProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = request.params;

  if (!productId) {
    return next(new ErrorResponse('Missing product ID', 422));
  }

  const product = await Product.findOne({ productId }).populate(
    'vendorId',
    'name email _id'
  );

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  response.status(200).json({ success: true, product });
};

/**
 * Update Product Status
 * @route PUT /api/admin/products/status
 * @access Private (Admin)
 */
export const updateProductStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { status, productId } = request.body;

  const product = await Product.findOneAndUpdate(
    { productId },
    { status },
    { new: true }
  ).populate('vendorId', 'name email _id');

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const vendorInfo = product.vendorId as any;

  const message = handlebars.compile(status ? productApproved : productRejected)({
    vendor_name: vendorInfo.name,
    product_name: product.name,
  });

  await sendEmail({
    to: vendorInfo.email,
    subject: status
      ? 'Product Approved – Now Live'
      : 'Product Submission Not Approved',
    message,
  });

  response.status(200).json({ success: true, product });
};

/**
 * Get Orders List
 * @route GET /api/admin/orders
 * @access Private (Admin)
 */
export const getOrders = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { count, type } = request.query;
  const countNum = parseInt(count as string) || 0;

  let orders: any[] = [];
  let totalOrders = 0;

  if (type === 'all') {
    orders = await Order.find()
      .skip(countNum * 10)
      .limit(10)
      .sort('-updatedAt');
    totalOrders = await Order.countDocuments();
  } else if (type === 'pending') {
    orders = await Order.find({ status: 'pending' })
      .skip(countNum * 10)
      .limit(10)
      .sort('-updatedAt');
    totalOrders = await Order.countDocuments({ status: 'pending' });
  }

  response.status(200).json({ success: true, orders, totalOrders });
};

/**
 * Fetch Order By ID
 * @route GET /api/admin/orders/:id
 * @access Private (Admin)
 */
export const fetchOrder = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  if (!id) {
    return next(new ErrorResponse('Missing order ID', 422));
  }

  const order = await Order.findOne({ orderId: id })
    .populate('userId', 'name phoneNumber invoiceIDs email')
    .populate('products.vendor');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  response.status(200).json({ success: true, order });
};

/**
 * Update Order Status
 * @route PUT /api/admin/orders/status
 * @access Private (Admin)
 */
export const updateOrderStatus = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { status, id } = request.body;

  if (!id || !status) {
    return next(new ErrorResponse('Missing order ID or status', 422));
  }

  const updatedOrder = await Order.findOneAndUpdate(
    { orderId: id },
    { status },
    { new: true }
  )
    .populate('userId', 'name phoneNumber invoiceIDs email')
    .populate('products.vendor');

  if (!updatedOrder) {
    return next(new ErrorResponse('Order not found', 404));
  }

  let pdfBuffer: Buffer | null = null;

  if (status === 'delivered') {
    updatedOrder.paymentStatus = true;
    await updatedOrder.save();

    pdfBuffer = await generateInvoicePDF({
      invoiceNo: updatedOrder.orderId,
      date: new Date().toLocaleDateString('en-US'),
      cus_name: updatedOrder.name,
      address: updatedOrder.fullAddress,
      phoneNumber: updatedOrder.phoneNumber,
      paymentMethod: updatedOrder.paymentMethod,
      items: updatedOrder.products.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.price * item.quantity,
      })),
      subTotal: updatedOrder.totalAmount - updatedOrder.shippingCost,
      shipping: updatedOrder.shippingCost,
      total: updatedOrder.totalAmount,
      status: updatedOrder.paymentStatus === false ? 'Not Paid' : 'Paid',
    });
  }

  const delivery = updatedOrder.paymentMethod === 'Online' ? DeliveryOnline : DeliveryCOD;

  let emailTemplate: string | null = null;
  if (status === 'cancelled') {
    emailTemplate = OrderCancelled;
  } else if (status === 'refunded') {
    emailTemplate = OrderRefund;
  } else if (status === 'dispatched') {
    emailTemplate = OrderDispatched;
  } else if (status === 'delivered') {
    emailTemplate = delivery;
  }

  const userInfo = updatedOrder.userId as any;

  if (emailTemplate) {
    const message = handlebars.compile(emailTemplate)({
      order_id: id,
      amount: updatedOrder.totalAmount,
    });

    let subject = '';
    if (status === 'dispatched') {
      subject = 'Your order is on the way!';
    } else if (status === 'delivered') {
      subject = 'Order delivered successfully';
    } else if (status === 'cancelled') {
      subject = 'Your order has been cancelled';
    } else if (status === 'refunded') {
      subject = 'Refund process - order cancellation';
    }

    await sendEmail({
      to: userInfo.email,
      subject,
      message,
      attachments: pdfBuffer
        ? [
            {
              filename: `Invoice-${updatedOrder.orderId}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ]
        : [],
    });
  }

  response.status(200).json({ success: true, order: updatedOrder });
};

/**
 * Generate Invoice PDF
 * @param invoiceData - Invoice data for PDF generation
 */
const generateInvoicePDF = async (invoiceData: IInvoiceData): Promise<Buffer | null> => {
  let browser = null;

  try {
    const html = handlebars.compile(invoiceTemplate)(invoiceData);

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1696 });

    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded'],
      timeout: 30000,
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice PDF:', (error as Error).message);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
