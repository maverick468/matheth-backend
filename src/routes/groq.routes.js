// src/routes/groq.routes.js
import { Router } from 'express';
import { handleRealtimeChat, generateQuickHint } from '../controllers/groq.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/chat', authenticate, rateLimiter, handleRealtimeChat);
router.post('/hint', authenticate, generateQuickHint);

export default router;