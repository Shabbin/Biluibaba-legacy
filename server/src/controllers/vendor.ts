import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import handlebars from 'handlebars';
import ErrorResponse from '../utils/ErrorResponse';
import { uploadMiddleware } from '../utils/Upload';
import { sendEmail } from '../utils/SendMail';
import Vendor, { IVendor } from '../models/vendor.model';
import Product from '../models/product.model';
import Order from '../models/order.model';
import { AuthenticatedRequest } from '../types';

// Load email template
const vendorReviewTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/new-signup.hbs'),
  'utf-8'
);

interface VendorRequest extends AuthenticatedRequest {
  vendor?: {
    id: string;
    name: string;
    storeName: string;
    email: string;
  };
  files?: {
    nidFront?: Express.Multer.File[];
    nidBack?: Express.Multer.File[];
  };
}

interface CreateVendorBody {
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  storeName: string;
  storeAddress: string;
  state: string;
  area: string;
  district: string;
  postcode: string;
  fullAddress: string;
  pickupAddress: string;
  nidNumber: string;
  companyRegistration?: string;
  tin: string;
  tradeLicense: string;
  bankAccountType: string;
  bankAccountName: string;
  bankAccountNumber: string;
  password: string;
}

/**
 * Create new vendor account
 * @route POST /api/vendor/create
 */
export const createVendor = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      type,
      name,
      phoneNumber,
      email,
      storeName,
      storeAddress,
      state,
      area,
      district,
      postcode,
      fullAddress,
      pickupAddress,
      nidNumber,
      companyRegistration,
      tin,
      tradeLicense,
      bankAccountType,
      bankAccountName,
      bankAccountNumber,
      password,
    } = request.body as CreateVendorBody;

    const { nidFront, nidBack } = request.files || {};

    // Validate required fields
    if (
      !type ||
      !name ||
      !phoneNumber ||
      !email ||
      !storeName ||
      !storeAddress ||
      !state ||
      !area ||
      !district ||
      !postcode ||
      !fullAddress ||
      !pickupAddress ||
      !nidNumber ||
      !tin ||
      !tradeLicense ||
      !bankAccountType ||
      !bankAccountName ||
      !bankAccountNumber ||
      !password
    ) {
      return next(new ErrorResponse('Missing information', 421));
    }

    if (type === 'Company' && !companyRegistration) {
      return next(new ErrorResponse('Missing information', 421));
    }

    const vendor = await Vendor.create({
      status: 'pending',
      type,
      name,
      phoneNumber,
      email,
      storeName,
      password,
      verified: false,
      address: {
        store: storeAddress,
        state,
        area,
        district,
        postcode,
        fullAddress,
        pickupAddress,
      },
      nid: {
        front: nidFront?.[0]?.filename || '',
        back: nidBack?.[0]?.filename || '',
        number: nidNumber,
      },
      companyRegistration,
      tax: {
        tin,
        tradeLicense,
      },
      bank: {
        accountType: bankAccountType,
        accountName: bankAccountName,
        accountNumber: bankAccountNumber,
      },
    });

    const message = handlebars.compile(vendorReviewTemplate)({
      vendor_name: vendor.name,
    });

    await sendEmail({
      to: vendor.email,
      subject: 'Your Vendor Application is Under Review',
      message,
    });

    response.status(200).json({ success: true, data: 'Vendor Created' });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server Error', 500));
  }
};

interface ProductQuery {
  count?: string;
  type?: 'all' | 'published';
}

/**
 * Get all vendor products
 * @route GET /api/vendor/products
 */
export const fetchAllProducts = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { count, type } = request.query as ProductQuery;
    const pageCount = parseInt(count || '0');

    let products = [];
    let totalProducts = 0;

    if (type === 'all') {
      products = await Product.find({ vendorId: request.vendor!.id })
        .skip(pageCount * 10)
        .limit(10)
        .sort('-createdAt');
      totalProducts = await Product.countDocuments({ vendorId: request.vendor!.id });
    } else if (type === 'published') {
      products = await Product.find({
        vendorId: request.vendor!.id,
        status: true,
      })
        .skip(pageCount * 10)
        .limit(10)
        .sort('-createdAt');
      totalProducts = await Product.countDocuments({
        vendorId: request.vendor!.id,
        status: true,
      });
    }

    response.status(200).json({ success: true, products, totalProducts });
  } catch (error) {
    next(error);
  }
};

interface OrderQuery {
  count?: string;
  type?: 'all' | 'pending';
}

/**
 * Get all vendor orders
 * @route GET /api/vendor/orders
 */
export const fetchAllOrders = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { count, type } = request.query as OrderQuery;
    const pageCount = parseInt(count || '0');

    let orders: any = null;
    let totalOrders = 0;

    if (type === 'all') {
      orders = await Vendor.findById(request.vendor!.id)
        .populate({
          path: 'orderIDs',
          select: 'orderId status totalAmount paymentMethod createdAt',
          options: { skip: pageCount * 10, limit: 10, sort: '-createdAt' },
        })
        .populate({
          path: 'orderIDs.userId',
          select: 'name phoneNumber',
        });

      const vendorData = await Vendor.findById(request.vendor!.id);
      totalOrders = vendorData?.orderIDs?.length || 0;
    } else if (type === 'pending') {
      orders = await Vendor.findById(request.vendor!.id)
        .populate({
          path: 'orderIDs',
          select: 'orderId status totalAmount paymentMethod createdAt',
          options: { skip: pageCount * 10, limit: 10, sort: '-createdAt' },
          match: { status: 'pending' },
        })
        .populate({
          path: 'orderIDs.userId',
          select: 'name phoneNumber',
        });

      const vendorData = await Vendor.findById(request.vendor!.id).populate({
        path: 'orderIDs',
        match: { status: 'pending' },
      });
      totalOrders = vendorData?.orderIDs?.length || 0;
    }

    response.status(200).json({ success: true, orders, totalOrders });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single order details
 * @route GET /api/vendor/order/:id
 */
export const fetchOrder = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    const order = await Order.findOne({ orderId: id }).populate({
      path: 'userId',
      select: 'name invoiceIDs email phoneNumber',
    });

    if (!order) {
      response.status(404).json({ success: false, message: 'No order found' });
      return;
    }

    // Filter products to only show vendor's products
    const filteredProducts = order.products.filter(
      (product) => product.vendor?.toString() === request.vendor!.id.toString()
    );

    response.status(200).json({
      success: true,
      order: {
        ...order.toObject(),
        products: filteredProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product details
 * @route GET /api/vendor/products/:id
 */
export const getProduct = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    const product = await Product.findOne({ productId: id }).populate({
      path: 'vendorId',
      select: 'name email phoneNumber',
    });

    if (!product) {
      response.status(404).json({ success: false, message: 'No product found' });
      return;
    }

    response.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Multer storage configuration for vendor documents
const vendorStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/vendor'));
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'nidFront') {
      cb(null, `nidFront-${Date.now()}${path.extname(file.originalname)}`);
    } else if (file.fieldname === 'nidBack') {
      cb(null, `nidBack-${Date.now()}${path.extname(file.originalname)}`);
    } else {
      cb(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  },
});

export const uploadVendor = uploadMiddleware(vendorStorage).fields([
  { name: 'nidFront', maxCount: 1 },
  { name: 'nidBack', maxCount: 1 },
]);

// Helper function to send JWT token
const sendToken = async (
  vendor: IVendor,
  statusCode: number,
  response: Response
): Promise<void> => {
  const token = vendor.getSignedToken();
  
  response
    .status(statusCode)
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict',
    })
    .json({ success: true });
};
