import { Router } from 'express';
import { checkEmail, login, logout } from '../controllers/app';

const router = Router();

router.post('/check-email', checkEmail);
router.post('/login', login);
router.post('/logout', logout);

export default router;
