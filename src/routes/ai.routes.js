import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';
// import { validateAiRequest } from '../validators/ai.validator.js'; // if you have one

const router = Router();

// CORRECT ORDER: uploadMiddleware.any() MUST run first to parse FormData
router.post(
  '/generate-quiz',
  uploadMiddleware.any(),
  // validateAiRequest, // Only place validators AFTER multer has populated req.body and req.files
  aiController.generateQuizController
);

export default router;