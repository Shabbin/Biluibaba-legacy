import { Router } from 'express';
import { protectUser } from '../middleware/auth';
import {
  createProductOrder,
  validateProductOrder,
} from '../controllers/order';

const router = Router();

// Public routes
router.post('/validate', validateProductOrder);

// Protected routes
router.use(protectUser);

router.post('/', createProductOrder);

export default router;
