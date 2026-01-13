import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import mongoose from 'mongoose';

import { Upload } from '../../utils/Upload';
import { ErrorResponse } from '../../utils/ErrorResponse';
import { SiteSettings, Product } from '../../models';

/**
 * Admin Site Settings Controller
 * Handles site settings and content management for admins
 */

interface IUploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

interface IRequestWithFiles extends Request {
  files?: {
    [fieldname: string]: IUploadedFile[];
  };
}

/**
 * Get Site Settings
 * @route GET /api/admin/site-settings
 * @access Private (Admin)
 */
export const getSiteSettings = async (
  _request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const site = await SiteSettings.findOne().populate('best_deals.products.id');

  response.status(200).json({ success: true, site });
};

/**
 * Update Best Deals Duration
 * @route PUT /api/admin/site-settings/best-deals/duration
 * @access Private (Admin)
 */
export const updateBestDealsDuration = async (
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const { duration } = request.body;

  const site = await SiteSettings.findOneAndUpdate(
    {},
    { $set: { 'best_deals.duration': duration } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Add Best Deals Product
 * @route POST /api/admin/site-settings/best-deals/product
 * @access Private (Admin)
 */
export const addBestDealsProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = request.body;

  if (!productId) {
    return next(new ErrorResponse('No product id', 422));
  }

  const product = await Product.findOne({ productId });

  if (!product) {
    response.status(200).json({
      success: false,
      message: "ProductID doesn't exist. Please try again!",
    });
    return;
  }

  const site = await SiteSettings.findOne();

  if (!site) {
    return next(new ErrorResponse('Site settings not found', 404));
  }

  const exists = site.best_deals.products.some(
    (p) => p.id.toString() === product._id.toString()
  );

  if (exists) {
    response.status(200).json({
      success: false,
      message: 'Product already exists in best deals.',
    });
    return;
  }

  site.best_deals.products.push({ id: product._id });
  await site.save();

  response.status(200).json({ success: true, site });
};

/**
 * Delete Best Deals Product
 * @route DELETE /api/admin/site-settings/best-deals/product/:productId
 * @access Private (Admin)
 */
export const deleteBestDealsProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = request.params;

  if (!productId) {
    return next(new ErrorResponse('No product id', 422));
  }

  const product = await Product.findOne({ productId });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const site = await SiteSettings.findOneAndUpdate(
    {},
    { $pull: { 'best_deals.products': { id: product._id } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Product Landing Sliders
 * @route POST /api/admin/site-settings/product-landing-slider
 * @access Private (Admin)
 */
export const updateProductLandingSliders = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const slider = request.files?.slider;
  const url = request.protocol + '://' + request.get('host');

  if (!slider || slider.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const newImages = slider.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/product-landing-slider/${file.filename}`,
  }));

  const site = await SiteSettings.findOneAndUpdate(
    { product_landing_slider: { $exists: true } },
    { $push: { product_landing_slider: { $each: newImages } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Delete Product Landing Slider
 * @route DELETE /api/admin/site-settings/product-landing-slider/:filename
 * @access Private (Admin)
 */
export const deleteProductLandingSlider = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { filename } = request.params;

  if (!filename) {
    return next(new ErrorResponse('No file', 422));
  }

  fs.unlinkSync(
    path.join(__dirname, `../../uploads/site-settings/product-landing-slider/${filename}`)
  );

  const site = await SiteSettings.findOneAndUpdate(
    { product_landing_slider: { $exists: true } },
    { $pull: { product_landing_slider: { filename } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Popular Category
 * @route POST /api/admin/site-settings/popular-category
 * @access Private (Admin)
 */
export const updatePopularCategory = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { name, value } = request.body;
  const category = request.files?.category;
  const url = request.protocol + '://' + request.get('host');

  if (!category || category.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }
  if (!name || !value) {
    return next(new ErrorResponse('Missing information', 422));
  }

  const site = await SiteSettings.findOneAndUpdate(
    { popular_product_category: { $exists: true } },
    {
      $push: {
        popular_product_category: {
          category: name,
          categorySlug: value,
          image: `${url}/uploads/site-settings/popular-category/${category[0].filename}`,
        },
      },
    },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Delete Popular Category
 * @route DELETE /api/admin/site-settings/popular-category/:id
 * @access Private (Admin)
 */
export const deletePopularCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  if (!id) {
    return next(new ErrorResponse('No id', 422));
  }

  const objectId = new mongoose.Types.ObjectId(`${id}`);

  const popularCategory = await SiteSettings.findOne(
    { 'popular_product_category._id': objectId },
    { 'popular_product_category.$': 1 }
  );

  if (!popularCategory) {
    return next(new ErrorResponse('Category not found', 404));
  }

  const filename = popularCategory.popular_product_category[0].image.split('/').pop();

  fs.unlinkSync(
    path.join(__dirname, `../../uploads/site-settings/popular-category/${filename}`)
  );

  const site = await SiteSettings.findOneAndUpdate(
    { popular_product_category: { $exists: true } },
    {
      $pull: {
        popular_product_category: {
          image: popularCategory.popular_product_category[0].image,
        },
      },
    },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Get Featured Products
 * @route GET /api/admin/site-settings/featured-product
 * @access Private (Admin)
 */
export const getFeaturedProducts = async (
  _request: Request,
  response: Response,
  _next: NextFunction
): Promise<void> => {
  const site = await SiteSettings.findOne({
    featured_product: { $exists: true },
  }).select('featured_product');

  if (!site) {
    response.status(200).json({ success: true, id: null });
    return;
  }

  const product = await Product.findOne({ _id: site.featured_product });

  response.status(200).json({ success: true, id: product?.productId || null });
};

/**
 * Update Featured Product
 * @route PUT /api/admin/site-settings/featured-product
 * @access Private (Admin)
 */
export const updateFeaturedProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = request.body;

  if (!productId) {
    return next(new ErrorResponse('No product id', 422));
  }

  const product = await Product.findOne({ productId });

  if (!product) {
    return next(new ErrorResponse('Product not found', 404));
  }

  const site = await SiteSettings.findOneAndUpdate(
    { featured_product: { $exists: true } },
    { $set: { featured_product: product._id } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Product Banner
 * @route POST /api/admin/site-settings/product-banner
 * @access Private (Admin)
 */
export const updateProductBanner = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const banner = request.files?.banner;
  const url = request.protocol + '://' + request.get('host');

  if (!banner || banner.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const site = await SiteSettings.findOne();

  if (!site) {
    return next(new ErrorResponse('Site settings not found', 404));
  }

  if (site.product_banner_one.filename !== '') {
    try {
      fs.unlinkSync(
        path.join(__dirname, `../../uploads/site-settings/${site.product_banner_one.filename}`)
      );
    } catch (error) {
      // File may not exist, continue
    }
  }

  site.product_banner_one.filename = banner[0].filename;
  site.product_banner_one.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  response.status(200).json({ success: true, site });
};

/**
 * Update Brand In Spotlight
 * @route POST /api/admin/site-settings/brand-in-spotlight
 * @access Private (Admin)
 */
export const updateBrandInSpotlight = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { name, slug } = request.body;
  const brand = request.files?.brand;
  const url = request.protocol + '://' + request.get('host');

  if (!brand || brand.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }
  if (!name || !slug) {
    return next(new ErrorResponse('Missing information', 422));
  }

  const site = await SiteSettings.findOneAndUpdate(
    { product_brands_in_spotlight: { $exists: true } },
    {
      $push: {
        product_brands_in_spotlight: {
          name: name,
          slug: slug,
          path: `${url}/uploads/site-settings/brand-in-spotlight/${brand[0].filename}`,
        },
      },
    },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Delete Brand In Spotlight
 * @route DELETE /api/admin/site-settings/brand-in-spotlight/:id
 * @access Private (Admin)
 */
export const deleteBrandInSpotlight = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = request.params;

  if (!id) {
    return next(new ErrorResponse('No id', 422));
  }

  const objectId = new mongoose.Types.ObjectId(`${id}`);

  const brandInSpotlight = await SiteSettings.findOne(
    { 'product_brands_in_spotlight._id': objectId },
    { 'product_brands_in_spotlight.$': 1 }
  );

  if (!brandInSpotlight) {
    return next(new ErrorResponse('Brand not found', 404));
  }

  const filename = brandInSpotlight.product_brands_in_spotlight[0].path.split('/').pop();

  fs.unlinkSync(
    path.join(__dirname, `../../uploads/site-settings/brand-in-spotlight/${filename}`)
  );

  const site = await SiteSettings.findOneAndUpdate(
    { product_brands_in_spotlight: { $exists: true } },
    {
      $pull: {
        product_brands_in_spotlight: {
          path: brandInSpotlight.product_brands_in_spotlight[0].path,
        },
      },
    },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Vet Landing Sliders
 * @route POST /api/admin/site-settings/vet-landing-slider
 * @access Private (Admin)
 */
export const updateVetLandingSliders = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const slider = request.files?.slider;
  const url = request.protocol + '://' + request.get('host');

  if (!slider || slider.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const newImages = slider.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/vet-landing-slider/${file.filename}`,
  }));

  const site = await SiteSettings.findOneAndUpdate(
    { vet_landing_slider: { $exists: true } },
    { $push: { vet_landing_slider: { $each: newImages } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Delete Vet Landing Slider
 * @route DELETE /api/admin/site-settings/vet-landing-slider/:filename
 * @access Private (Admin)
 */
export const deleteVetLandingSlider = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { filename } = request.params;

  if (!filename) {
    return next(new ErrorResponse('No file', 422));
  }

  fs.unlinkSync(
    path.join(__dirname, `../../uploads/site-settings/vet-landing-slider/${filename}`)
  );

  const site = await SiteSettings.findOneAndUpdate(
    { vet_landing_slider: { $exists: true } },
    { $pull: { vet_landing_slider: { filename } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Vet Banner One
 * @route POST /api/admin/site-settings/vet-banner-one
 * @access Private (Admin)
 */
export const updateVetBannerOne = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const banner = request.files?.banner;
  const url = request.protocol + '://' + request.get('host');

  if (!banner || banner.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const site = await SiteSettings.findOne();

  if (!site) {
    return next(new ErrorResponse('Site settings not found', 404));
  }

  if (site.vet_banner_one.filename !== '') {
    try {
      fs.unlinkSync(
        path.join(__dirname, `../../uploads/site-settings/${site.vet_banner_one.filename}`)
      );
    } catch (error) {
      // File may not exist, continue
    }
  }

  site.vet_banner_one.filename = banner[0].filename;
  site.vet_banner_one.path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  response.status(200).json({ success: true, site });
};

/**
 * Update Vet Grid Banners
 * @route POST /api/admin/site-settings/vet-grid-banners
 * @access Private (Admin)
 */
export const updateVetGridBanners = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const banner = request.files?.banner;
  const url = request.protocol + '://' + request.get('host');

  if (!banner || banner.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const newImages = banner.map((file) => ({
    filename: file.filename,
    path: `${url}/uploads/site-settings/vet-grid-banner/${file.filename}`,
  }));

  const site = await SiteSettings.findOneAndUpdate(
    { vet_grid_banners: { $exists: true } },
    { $push: { vet_grid_banners: { $each: newImages } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Delete Vet Grid Banner
 * @route DELETE /api/admin/site-settings/vet-grid-banner/:filename
 * @access Private (Admin)
 */
export const deleteVetGridBanner = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const { filename } = request.params;

  if (!filename) {
    return next(new ErrorResponse('No file', 422));
  }

  fs.unlinkSync(
    path.join(__dirname, `../../uploads/site-settings/vet-grid-banner/${filename}`)
  );

  const site = await SiteSettings.findOneAndUpdate(
    { vet_grid_banners: { $exists: true } },
    { $pull: { vet_grid_banners: { filename } } },
    { new: true }
  );

  response.status(200).json({ success: true, site });
};

/**
 * Update Adoption Banner One
 * @route POST /api/admin/site-settings/adoption-banner-one
 * @access Private (Admin)
 */
export const updateAdoptionBannerOne = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const banner = request.files?.banner;
  const url = request.protocol + '://' + request.get('host');

  if (!banner || banner.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const site = await SiteSettings.findOne();

  if (!site) {
    return next(new ErrorResponse('Site settings not found', 404));
  }

  if (site.adoption_banner_one && (site.adoption_banner_one as any).filename) {
    try {
      fs.unlinkSync(
        path.join(
          __dirname,
          `../../uploads/site-settings/adoption-banner/${(site.adoption_banner_one as any).filename}`
        )
      );
    } catch (error) {
      // File may not exist, continue
    }
  }

  (site.adoption_banner_one as any).filename = banner[0].filename;
  (site.adoption_banner_one as any).path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  response.status(200).json({ success: true, site });
};

/**
 * Update Adoption Banner Two
 * @route POST /api/admin/site-settings/adoption-banner-two
 * @access Private (Admin)
 */
export const updateAdoptionBannerTwo = async (
  request: IRequestWithFiles,
  response: Response,
  next: NextFunction
): Promise<void> => {
  const banner = request.files?.banner;
  const url = request.protocol + '://' + request.get('host');

  if (!banner || banner.length <= 0) {
    return next(new ErrorResponse('No file', 422));
  }

  const site = await SiteSettings.findOne();

  if (!site) {
    return next(new ErrorResponse('Site settings not found', 404));
  }

  if (site.adoption_banner_two && (site.adoption_banner_two as any).filename) {
    try {
      fs.unlinkSync(
        path.join(
          __dirname,
          `../../uploads/site-settings/adoption-banner/${(site.adoption_banner_two as any).filename}`
        )
      );
    } catch (error) {
      // File may not exist, continue
    }
  }

  (site.adoption_banner_two as any).filename = banner[0].filename;
  (site.adoption_banner_two as any).path = `${url}/uploads/site-settings/${banner[0].filename}`;

  await site.save();

  response.status(200).json({ success: true, site });
};

// Multer storage configurations
const productLandingSliderStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/product-landing-slider'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'slider') {
      cb(null, 'slider-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const popularCategoryStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/popular-category'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'category') {
      cb(null, 'category-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const productBannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'banner') {
      cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const brandInSpotlightStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/brand-in-spotlight'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'brand') {
      cb(null, 'brand-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const vetLandingSliderStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/vet-landing-slider'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'slider') {
      cb(null, 'slider-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const vetGridBannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/vet-grid-banner'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'banner') {
      cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const vetBannerOneStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'banner') {
      cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

const adoptionBannerStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/site-settings/adoption-banner'));
  },
  filename: (_req, file, cb) => {
    if (file.fieldname === 'banner') {
      cb(null, 'banner-' + Date.now() + path.extname(file.originalname));
    } else {
      cb(new Error('Invalid fieldname'), '');
    }
  },
});

// Upload middlewares
export const uploadProductLandingSliders = Upload(productLandingSliderStorage).fields([
  { name: 'slider', maxCount: 10 },
]);

export const uploadPopularCategory = Upload(popularCategoryStorage).fields([
  { name: 'category', maxCount: 1 },
]);

export const uploadProductBanner = Upload(productBannerStorage).fields([
  { name: 'banner', maxCount: 1 },
]);

export const uploadBrandInSpotlight = Upload(brandInSpotlightStorage).fields([
  { name: 'brand', maxCount: 1 },
]);

export const uploadVetLandingSliders = Upload(vetLandingSliderStorage).fields([
  { name: 'slider', maxCount: 10 },
]);

export const uploadVetGridBanners = Upload(vetGridBannerStorage).fields([
  { name: 'banner', maxCount: 3 },
]);

export const uploadVetBannerOne = Upload(vetBannerOneStorage).fields([
  { name: 'banner', maxCount: 1 },
]);

export const uploadAdoptionBanner = Upload(adoptionBannerStorage).fields([
  { name: 'banner', maxCount: 1 },
]);
