// src/routes/referral.routes.js
import { Router } from 'express';
import { getReferralStats, createReferralCode } from '../controllers/referral.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/stats', authenticate, getReferralStats);
router.post('/generate', authenticate, createReferralCode);

export default router;