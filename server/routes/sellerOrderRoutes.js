import express from 'express';
import {
  getSellerOrders,
  getSellerOrderById,
  updateSellerOrderStatus,
} from '../controllers/sellerOrderController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireRole('seller'));

router.get('/', getSellerOrders);
router.get('/:id', getSellerOrderById);
router.put('/:id/status', updateSellerOrderStatus);

export default router;
