import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, requireRole('buyer'));

router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);

export default router;
