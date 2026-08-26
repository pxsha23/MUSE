import { asyncHandler } from '../utils/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';

const PRODUCT_FIELDS = 'title price compareAtPrice images category storeName storeSlug seller isActive isPublished';

const getOrCreateWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

// @route GET /api/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate({ path: 'products', select: PRODUCT_FIELDS });
  const products = wishlist.products.filter((p) => p && p.isActive && p.isPublished);
  res.json({ products });
});

// @route POST /api/wishlist/:productId
export const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  if (!wishlist.products.some((p) => String(p) === req.params.productId)) {
    wishlist.products.push(req.params.productId);
    await wishlist.save();
  }
  res.status(201).json({ productIds: wishlist.products });
});

// @route DELETE /api/wishlist/:productId
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  wishlist.products = wishlist.products.filter((p) => String(p) !== req.params.productId);
  await wishlist.save();
  res.json({ productIds: wishlist.products });
});
