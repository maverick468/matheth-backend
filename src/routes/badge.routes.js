// src/routes/badge.routes.js
import { Router } from 'express';
import { getUserBadges, claimBadge } from '../controllers/badge.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getUserBadges);
router.post('/claim', authenticate, claimBadge);

export default router;