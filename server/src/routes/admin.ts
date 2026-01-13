import { Router } from 'express';
import { protectAdmin } from '../middleware/auth';
import { login } from '../controllers/admin';
import { getUsers } from '../controllers/admin/users';
import {
  getVendors,
  getProducts,
  getOrders,
  fetchOrder,
  updateOrderStatus,
  getProduct,
  updateProductStatus,
  getVendorById,
  updateVendorStatus,
} from '../controllers/admin/vendors';
import {
  getApprovedAdoptions,
  setAdoptionStatus,
  getAdoptionOrders,
  getAdoptionOrderById,
} from '../controllers/admin/adoptions';
import {
  getSiteSettings,
  uploadProductLandingSliders,
  updateProductLandingSliders,
  deleteProductLandingSlider,
  uploadPopularCategory,
  updatePopularCategory,
  deletePopularCategory,
  updateFeaturedProduct,
  uploadProductBanner,
  updateProductBanner,
  uploadBrandInSpotlight,
  updateBrandInSpotlight,
  deleteBrandInSpotlight,
  uploadVetLandingSliders,
  updateVetLandingSliders,
  deleteVetLandingSlider,
  uploadVetGridBanners,
  updateVetGridBanners,
  deleteVetGridBanner,
  uploadVetBannerOne,
  updateVetBannerOne,
  uploadAdoptionBanner,
  updateAdoptionBannerOne,
  updateAdoptionBannerTwo,
  addBestDealsProduct,
  deleteBestDealsProduct,
  updateBestDealsDuration,
} from '../controllers/admin/site-settings';

const router = Router();

// Public routes
router.post('/login', login);
router.get('/site-settings', getSiteSettings);

// Protected routes
router.use(protectAdmin);

// User routes
router.get('/users', getUsers);

// Adoption routes
router.get('/adoptions/fetch', getApprovedAdoptions);
router.post('/adoptions/status/:id', setAdoptionStatus);
router.get('/adoptions/order', getAdoptionOrders);
router.get('/adoptions/order/:id', getAdoptionOrderById);

// Vendor routes
router.get('/vendors', getVendors);
router.get('/vendors/products', getProducts);
router.get('/vendors/:id', getVendorById);
router.post('/vendors/status', updateVendorStatus);

// Order routes
router.get('/orders', getOrders);
router.get('/orders/:id', fetchOrder);
router.post('/orders/status', updateOrderStatus);

// Product routes
router.get('/products/:productId', getProduct);
router.post('/products/status', updateProductStatus);

// Site settings routes
router.post(
  '/site-settings/product-landing-slider',
  uploadProductLandingSliders,
  updateProductLandingSliders
);
router.delete(
  '/site-settings/product-landing-slider/:filename',
  deleteProductLandingSlider
);
router.post(
  '/site-settings/popular-category',
  uploadPopularCategory,
  updatePopularCategory
);
router.delete('/site-settings/popular-category/:id', deletePopularCategory);
router.post('/site-settings/featured-product', updateFeaturedProduct);
router.post(
  '/site-settings/product-banner-one',
  uploadProductBanner,
  updateProductBanner
);
router.post(
  '/site-settings/brand-in-spotlight',
  uploadBrandInSpotlight,
  updateBrandInSpotlight
);
router.delete('/site-settings/brand-in-spotlight/:id', deleteBrandInSpotlight);
router.post(
  '/site-settings/vet-landing-slider',
  uploadVetLandingSliders,
  updateVetLandingSliders
);
router.delete(
  '/site-settings/vet-landing-slider/:filename',
  deleteVetLandingSlider
);
router.post(
  '/site-settings/vet-grid-banners',
  uploadVetGridBanners,
  updateVetGridBanners
);
router.delete('/site-settings/vet-grid-banners/:filename', deleteVetGridBanner);
router.post('/site-settings/vet-banner-one', uploadVetBannerOne, updateVetBannerOne);
router.post(
  '/site-settings/adoption-banner-one',
  uploadAdoptionBanner,
  updateAdoptionBannerOne
);
router.post(
  '/site-settings/adoption-banner-two',
  uploadAdoptionBanner,
  updateAdoptionBannerTwo
);
router.post('/site-settings/best-deals/products', addBestDealsProduct);
router.delete(
  '/site-settings/best-deals/products/:productId',
  deleteBestDealsProduct
);
router.post('/site-settings/best-deals', updateBestDealsDuration);

export default router;
