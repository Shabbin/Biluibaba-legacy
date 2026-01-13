import { Router } from 'express';
import { protectVet, protectUser } from '../middleware/auth';
import {
  createVet,
  uploadVet,
  updateSlot,
  getVetDetails,
  updateAvailability,
  getVets,
  uploadProfilePicture,
  updateVet,
  getVet,
  getAllVetId,
  getExpertVets,
  bookAppointment,
  validateAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  getUpcomingAppointments,
  submitReview,
} from '../controllers/vet';

const router = Router();

// Public routes
router.get('/', getExpertVets);
router.get('/get', getVets);
router.get('/get/:id', getVet);
router.post('/create', uploadVet, createVet);
router.get('/get-all-id', getAllVetId);
router.post('/appointment/validate', validateAppointment);

// User protected routes
router.post('/rating', protectUser, submitReview);
router.post('/appointment/create', protectUser, bookAppointment);

// Vet protected routes
router.use(protectVet);

router.get('/me', getVetDetails);
router.post('/update', uploadProfilePicture, updateVet);
router.post('/update/slot', updateSlot);
router.post('/update/availability', updateAvailability);
router.get('/appointment', getAppointment);
router.get('/appointments', getAppointments);
router.get('/upcoming-appointments', getUpcomingAppointments);
router.post('/appointment/update', updateAppointment);

export default router;
