import { Router } from 'express';
import { getAccessToken } from '../controllers/room';

const router = Router();

router.post('/token', getAccessToken);

export default router;
