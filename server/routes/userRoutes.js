import express from 'express';
import { updateMe, uploadAvatar } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.put('/me', protect, updateMe);
router.post('/me/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
