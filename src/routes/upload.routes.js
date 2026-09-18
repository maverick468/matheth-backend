import express from 'express';
import { uploadController } from '../controllers/upload.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = express.Router();

const handleFn = uploadController?.handleUpload || uploadController?.handleFileUpload;

// Add uploadMiddleware.single('document') matching your frontend FormData field name
router.post('/', uploadMiddleware.single('document'), handleFn);

export default router;