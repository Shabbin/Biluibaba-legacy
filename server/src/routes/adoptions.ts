import { Router } from 'express';
import { protectUser } from '../middleware/auth';
import {
  createAdoption,
  uploadAdoptionImage,
  getAdoptions,
  getAdoption,
  orderAdoption,
  validateAdoptionOrder,
  getAdoptionsList,
  getAdoptionsWishlist,
  deleteAdoption,
  getOrderDetails,
  updateOrderDetails,
} from '../controllers/adoptions';

const router = Router();

// Public routes
router.get('/', getAdoptions);
router.get('/get/:id', getAdoption);
router.post('/validate', validateAdoptionOrder);
router.get('/application', getOrderDetails);
router.post('/application', updateOrderDetails);

// Protected routes
router.use(protectUser);

router.post('/create', uploadAdoptionImage, createAdoption);
router.post('/order', orderAdoption);
router.get('/list', getAdoptionsList);
router.get('/wishlist', getAdoptionsWishlist);
router.post('/delete/:id', deleteAdoption);

export default router;
