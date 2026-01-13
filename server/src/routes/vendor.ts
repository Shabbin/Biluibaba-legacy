import { Router } from 'express';
import { protectVendor } from '../middleware/auth';
import {
  uploadVendor,
  createVendor,
  fetchAllProducts,
  fetchAllOrders,
  fetchOrder,
  getProduct,
} from '../controllers/vendor';

const router = Router();

// Public routes
router.post('/create', uploadVendor, createVendor);

// Protected routes
router.use(protectVendor);

router.get('/products', fetchAllProducts);
router.get('/products/:id', getProduct);
router.get('/orders', fetchAllOrders);
router.get('/order/:id', fetchOrder);

export default router;
