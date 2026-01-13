import { Router } from 'express';
import {
  login,
  register,
  authenticateFacebook,
  authenticateGoogle,
  getUserInfo,
  logoutUser,
  updateUserInfo,
  getOrders,
  getBookings,
} from '../controllers/auth';
import { protectUser } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/facebook', authenticateFacebook);
router.get('/google', authenticateGoogle);

// Protected routes
router.use(protectUser);

router.get('/me', getUserInfo);
router.post('/update-profile', updateUserInfo);
router.get('/orders', getOrders);
router.get('/vet', getBookings);
router.get('/logout', logoutUser);

export default router;
