import express from 'express';
import { createOrder, verifyPayment, getMyOrders, getMyOrderById } from '../controllers/orderController.js';
import { protect, requireRole, requireVerified } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireRole('buyer'));

router.get('/', getMyOrders);
router.post('/', requireVerified, createOrder);
router.post('/verify', requireVerified, verifyPayment);
router.get('/:id', getMyOrderById);

export default router;
