// src/routes/auth.routes.js
import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { userValidator } from '../validators/user.validator.js';

const router = Router();

router.post('/register', validateRequest(userValidator.register), register);
router.post('/login', validateRequest(userValidator.login), login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validateRequest(userValidator.update), updateProfile);

export default router;