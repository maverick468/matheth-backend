// backend/src/routes/admin.routes.js
import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAdminPasscode } from '../middleware/adminAuth.js';

const router = express.Router();

// Secure admin routes with the passcode middleware
router.use(requireAdminPasscode);

router.post('/levels', adminController.addLevelBatch);
router.get('/levels', adminController.getLevels);
router.put('/levels/:id', adminController.updateLevelBatch); // Added to support editing batches
router.delete('/levels/:id', adminController.deleteLevel);

export default router;