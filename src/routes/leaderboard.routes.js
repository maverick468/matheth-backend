// src/routes/leaderboard.routes.js
import { Router } from 'express';
import { getLeaderboard, getUserRank } from '../controllers/leaderboard.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, getLeaderboard);
router.get('/rank', authenticate, getUserRank);

export default router;