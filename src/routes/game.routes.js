// src/routes/game.routes.js
import { Router } from 'express';
import { startGame, submitScore, getGameHistory } from '../controllers/game.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { gameValidator } from '../validators/game.validator.js';

const router = Router();

router.post('/start', authenticate, validateRequest(gameValidator.start), startGame);
router.post('/submit', authenticate, validateRequest(gameValidator.submit), submitScore);
router.get('/history', authenticate, getGameHistory);

export default router;