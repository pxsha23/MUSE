import mongoose from 'mongoose';
import { CATEGORY_VALUES } from '../utils/constants.js';

const productSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    storeName: { type: String, required: true },
    storeSlug: { type: String, required: true, index: true },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, enum: CATEGORY_VALUES, required: true },

    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    video: {
      url: { type: String },
      publicId: { type: String },
    },

    stock: { type: Number, default: 0, min: 0 },
    tags: [{ type: String, trim: true, lowercase: true }],

    isPublished: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ isPublished: 1, isActive: 1, category: 1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);
export default Product;
