import express from 'express';
import {
  getProducts,
  getMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  removeProductImage,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const productFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 },
]);

router.get('/', getProducts);
router.get('/mine', protect, requireRole('seller'), getMyProducts);
router.get('/:id', getProductById);

router.post('/', protect, requireRole('seller'), productFiles, createProduct);
router.put('/:id', protect, requireRole('seller'), productFiles, updateProduct);
router.delete('/:id/images/:publicId', protect, requireRole('seller'), removeProductImage);
router.delete('/:id', protect, requireRole('seller'), deleteProduct);

export default router;
