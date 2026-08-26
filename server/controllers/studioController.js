import { asyncHandler } from '../utils/asyncHandler.js';
import Wishlist from '../models/Wishlist.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { CATEGORY_PAIRINGS, CATEGORIES } from '../utils/constants.js';

const PRODUCT_FIELDS = 'title price compareAtPrice images category storeName storeSlug seller';
const CATEGORY_LABELS = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));
const SUGGESTIONS_PER_CATEGORY = 4;

// @route GET /api/studio  (buyer) — "complete the look" recommendations from liked + cart items
export const getStudio = asyncHandler(async (req, res) => {
  const [wishlist, cart] = await Promise.all([
    Wishlist.findOne({ user: req.user._id }).populate({ path: 'products', select: PRODUCT_FIELDS }),
    Cart.findOne({ user: req.user._id }).populate({ path: 'items.product', select: PRODUCT_FIELDS }),
  ]);

  const pickMap = new Map();
  for (const p of wishlist?.products || []) {
    if (p) pickMap.set(String(p._id), { ...p.toObject(), source: 'liked' });
  }
  for (const item of cart?.items || []) {
    const p = item.product;
    if (!p) continue;
    const existing = pickMap.get(String(p._id));
    pickMap.set(String(p._id), { ...p.toObject(), source: existing ? 'liked+cart' : 'cart' });
  }
  const picks = Array.from(pickMap.values());

  if (picks.length === 0) {
    return res.json({ picks: [], suggestions: [] });
  }

  const pickedCategories = [...new Set(picks.map((p) => p.category))];
  const pickedProductIds = new Set(picks.map((p) => String(p._id)));

  const targetCategories = [
    ...new Set(pickedCategories.flatMap((c) => CATEGORY_PAIRINGS[c] || [])),
  ].filter((c) => !pickedCategories.includes(c));

  const suggestions = [];
  for (const category of targetCategories) {
    const products = await Product.find({
      category,
      isPublished: true,
      isActive: true,
      _id: { $nin: Array.from(pickedProductIds) },
    })
      .sort({ createdAt: -1 })
      .limit(SUGGESTIONS_PER_CATEGORY)
      .select(PRODUCT_FIELDS);

    if (products.length > 0) {
      suggestions.push({ category, label: CATEGORY_LABELS[category] || category, products });
    }
  }

  res.json({ picks, suggestions });
});
