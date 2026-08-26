import express from 'express';
import { getStudio } from '../controllers/studioController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, requireRole('buyer'), getStudio);

export default router;
