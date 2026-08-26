import express from 'express';
import {
  getStoreBySlug,
  getMyStore,
  updateMyStore,
  uploadStoreLogo,
  uploadStoreBanner,
} from '../controllers/storeController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/me', protect, requireRole('seller'), getMyStore);
router.put('/me', protect, requireRole('seller'), updateMyStore);
router.post(
  '/me/logo',
  protect,
  requireRole('seller'),
  upload.single('logo'),
  uploadStoreLogo
);
router.post(
  '/me/banner',
  protect,
  requireRole('seller'),
  upload.single('banner'),
  uploadStoreBanner
);
router.get('/:slug', getStoreBySlug);

export default router;
