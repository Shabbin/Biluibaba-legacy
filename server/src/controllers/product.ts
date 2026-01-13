import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import slugify from 'slugify';
import handlebars from 'handlebars';
import ErrorResponse from '../utils/ErrorResponse';
import { uploadMiddleware } from '../utils/Upload';
import { generateRandomId } from '../utils/GenerateId';
import { sendEmail } from '../utils/SendMail';
import Product from '../models/product.model';
import Vendor from '../models/vendor.model';
import SiteSettings from '../models/site-settings.model';
import { AuthenticatedRequest } from '../types';

// Load email template
const productReviewTemplate = fs.readFileSync(
  path.join(__dirname, '../../templates/vendor/product-review.hbs'),
  'utf-8'
);

interface ProductQuery {
  parent?: string;
  category?: string;
  count?: string;
}

/**
 * Get products by type and category
 * @route GET /api/product/:type/:category
 */
export const getProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, type } = request.params;
    let products;

    if (type === 'featured') {
      products = await Product.find({ featured: true });
    } else if (type === 'parent') {
      products = await Product.find({ 'categories.parent': category });
    } else if (type === 'sub') {
      products = await Product.find({ 'categories.sub': category });
    }

    response.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

/**
 * Search products by name or tags
 * @route GET /api/product/search
 */
export const searchProducts = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = request.query;

    if (!query || (query as string).trim() === '') {
      response.json({ success: true, products: [] });
      return;
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    }).limit(10);

    response.status(200).json({ success: true, products });
  } catch (error) {
    console.error('Error searching products:', error);
    response.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get best deals products
 * @route GET /api/product/best-deals
 */
export const getBestDeals = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { count } = request.query;
    const pageCount = parseInt(count as string) || 0;

    const site = await SiteSettings.findOne({
      best_deals: { $exists: true },
    }).populate('best_deals.products.id');

    if (!site) {
      response.status(200).json({
        success: true,
        products: [],
        totalProducts: 0,
        duration: 0,
      });
      return;
    }

    const startIndex = pageCount * 40;
    const endIndex = startIndex + 40;
    const products = site.best_deals.products.slice(startIndex, endIndex);

    response.status(200).json({
      success: true,
      products,
      totalProducts: site.best_deals.products.length,
      duration: site.best_deals.duration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get pet products by category
 * @route GET /api/product/get
 */
export const getPetProducts = async (
  request: Request<{}, {}, {}, ProductQuery>,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { parent, category, count } = request.query;
    const pageCount = parseInt(count || '0');

    const categoryQuery = {
      'categories.parent': parent,
      'categories.category': category,
    };

    const products = await Product.find(categoryQuery)
      .limit(40)
      .skip(pageCount * 40)
      .sort('-createdAt');

    const totalProducts = await Product.countDocuments(categoryQuery);

    response.status(200).json({ success: true, products, totalProducts });
  } catch (error) {
    console.error('Error fetching pet products:', error);
    response.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Get single product by slug
 * @route GET /api/product/get/:slug
 */
export const getProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = request.params;

    const product = await Product.findOne({ slug })
      .populate({
        path: 'reviews.userId',
        select: 'name avatar',
      })
      .populate({
        path: 'vendorId',
        select: 'storeName avatar _id',
      });

    if (!product) {
      return next(new ErrorResponse('No product found', 404));
    }

    const products = await Product.find({
      'categories.parent': product.categories[0]?.parent,
      _id: { $ne: product._id },
    })
      .limit(10)
      .sort({ createdAt: -1 });

    response.status(200).json({ success: true, product, products });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit product review
 * @route POST /api/product/rating
 */
export const submitReview = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId, comment, rating } = request.body;

    if (!productId || !rating) {
      return next(new ErrorResponse('Missing information', 422));
    }

    if (rating < 1 || rating > 5) {
      return next(new ErrorResponse('Invalid rating value', 422));
    }

    const product = await Product.findOne({ productId });

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    const review = {
      userId: request.user!.id,
      comment,
      rating,
      date: new Date(),
    };

    product.reviews.push(review);
    product.totalRatings = (product.totalRatings || 0) + rating;
    product.totalReviews = (product.totalReviews || 0) + 1;

    // Update ratings breakdown
    if (!product.ratingBreakdown) {
      product.ratingBreakdown = {
        excellent: 0,
        veryGood: 0,
        good: 0,
        average: 0,
        poor: 0,
      };
    }

    switch (rating) {
      case 5:
        product.ratingBreakdown.excellent += 1;
        break;
      case 4:
        product.ratingBreakdown.veryGood += 1;
        break;
      case 3:
        product.ratingBreakdown.good += 1;
        break;
      case 2:
        product.ratingBreakdown.average += 1;
        break;
      case 1:
        product.ratingBreakdown.poor += 1;
        break;
    }

    await product.save();

    response.status(200).json({ success: true, message: 'Review added' });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server error', 500));
  }
};

interface VendorRequest extends AuthenticatedRequest {
  vendor?: {
    id: string;
    name: string;
    storeName: string;
    email: string;
  };
  files?: {
    images?: Express.Multer.File[];
  };
}

/**
 * Create new product
 * @route POST /api/product/create
 */
export const createProduct = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, description, categories, tags, size, price, discount, quantity } = request.body;
    const url = `${request.protocol}://${request.get('host')}`;

    const uploadImages = request.files?.images?.map((file) => ({
      filename: file.filename,
      path: `${url}/uploads/product/${file.filename}`,
    })) || [];

    const productId = generateRandomId(32);

    const product = await Product.create({
      productId,
      slug: `${slugify(name, { lower: true })}-${productId}`,
      status: false,
      name,
      description,
      categories: JSON.parse(categories),
      price: Number(price),
      size: Number(size),
      quantity: Number(quantity),
      discount: Number(discount),
      tags: JSON.parse(tags),
      images: uploadImages,
      orderCount: 0,
      featured: false,
      vendorId: request.vendor!.id,
      vendorName: request.vendor!.storeName,
      ratings: 0,
      views: 0,
      isDeleted: false,
    });

    await Vendor.findByIdAndUpdate(request.vendor!.id, {
      $push: { productIDs: product._id },
      $inc: { totalListedProducts: 1 },
    });

    const message = handlebars.compile(productReviewTemplate)({
      vendor_name: request.vendor!.name,
      product_name: product.name,
    });

    await sendEmail({
      to: request.vendor!.email,
      subject: 'Product Submitted – Pending Review',
      message,
    });

    response.status(200).json({ success: true, productId: product.productId });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Missing information', 421));
  }
};

/**
 * Update existing product
 * @route POST /api/product/update
 */
export const updateProduct = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      name,
      description,
      categories,
      tags,
      size,
      price,
      discount,
      quantity,
      productId,
    } = request.body;

    const product = await Product.findOne({ productId });

    if (!product) {
      return next(new ErrorResponse('Product not found', 421));
    }

    product.status = false;
    product.name = name;
    product.description = description;
    product.categories = JSON.parse(categories);
    product.tags = JSON.parse(tags);
    product.size = Number(size);
    product.price = Number(price);
    product.discount = Number(discount);
    product.quantity = Number(quantity);

    await product.save();

    response.status(200).json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse('Server error', 500));
  }
};

/**
 * Update product status (unpublish)
 * @route POST /api/product/status/:id
 */
export const updateProductStatus = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    if (!id) {
      return next(new ErrorResponse('Missing product ID', 422));
    }

    const product = await Product.findOne({ productId: id });

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    product.status = false;
    await product.save();

    response.status(200).json({ success: true, message: 'Product unpublished' });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product permanently
 * @route DELETE /api/product/delete/:id
 */
export const deleteProduct = async (
  request: VendorRequest,
  response: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = request.params;

    if (!id) {
      return next(new ErrorResponse('Missing product ID', 422));
    }

    const product = await Product.findOne({ productId: id });

    if (!product) {
      return next(new ErrorResponse('Product not found', 404));
    }

    // Delete product images
    for (const image of product.images) {
      const imagePath = path.join(__dirname, '../../uploads/product', image.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Product.deleteOne({ productId: id });

    response.status(200).json({ success: true, message: 'Product permanently deleted' });
  } catch (error) {
    next(error);
  }
};

// Multer storage configuration for product images
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/product'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

export const uploadProductImage = uploadMiddleware(productImageStorage).fields([
  { name: 'images', maxCount: 4 },
]);
