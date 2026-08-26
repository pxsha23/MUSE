import express from 'express';
import { getCart, addCartItem, updateCartItem, removeCartItem } from '../controllers/cartController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireRole('buyer'));

router.get('/', getCart);
router.post('/items', addCartItem);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

export default router;
