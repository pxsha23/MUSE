import express from 'express';
import { getStoryFeed, getMyStories, createStory, deleteStory } from '../controllers/storyController.js';
import { protect, requireRole, requireVerified } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/feed', getStoryFeed);
router.get('/mine', protect, requireRole('seller'), getMyStories);
router.post(
  '/',
  protect,
  requireRole('seller'),
  requireVerified,
  upload.single('media'),
  createStory
);
router.delete('/:id', protect, requireRole('seller'), deleteStory);

export default router;
