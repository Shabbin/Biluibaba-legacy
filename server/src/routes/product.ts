import { Router } from 'express';
import { protectVendor, protectUser } from '../middleware/auth';
import {
  createProduct,
  uploadProductImage,
  getProducts,
  getProduct,
  getPetProducts,
  submitReview,
  getBestDeals,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  searchProducts,
} from '../controllers/product';

const router = Router();

// Public routes
router.get('/get/:slug', getProduct);
router.get('/search', searchProducts);
router.get('/:type/:category', getProducts);
router.get('/get', getPetProducts);
router.get('/best-deals', getBestDeals);

// Vendor protected routes
router.post('/create', protectVendor, uploadProductImage, createProduct);
router.post('/update', protectVendor, updateProduct);
router.delete('/delete/:id', protectVendor, deleteProduct);
router.post('/status/:id', protectVendor, updateProductStatus);

// User protected routes
router.post('/rating', protectUser, submitReview);

export default router;
