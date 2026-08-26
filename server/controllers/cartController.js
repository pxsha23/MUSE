import { asyncHandler } from '../utils/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const PRODUCT_FIELDS = 'title price compareAtPrice images stock isActive isPublished storeName storeSlug seller';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

const buildCartResponse = async (cart) => {
  const populated = await cart.populate({ path: 'items.product', select: PRODUCT_FIELDS });

  const groups = new Map();
  let total = 0;

  for (const item of populated.items) {
    const p = item.product;
    if (!p) continue; // product was hard-removed
    const available = p.isActive && p.isPublished;
    const lineTotal = available ? p.price * item.quantity : 0;
    if (available) total += lineTotal;

    const sellerId = String(item.seller);
    if (!groups.has(sellerId)) {
      groups.set(sellerId, {
        seller: sellerId,
        storeName: p.storeName,
        storeSlug: p.storeSlug,
        items: [],
        subtotal: 0,
      });
    }
    const group = groups.get(sellerId);
    group.items.push({
      product: p._id,
      title: p.title,
      image: p.images?.[0]?.url,
      price: p.price,
      quantity: item.quantity,
      stock: p.stock,
      available,
      lineTotal,
    });
    if (available) group.subtotal += lineTotal;
  }

  return { sellers: Array.from(groups.values()), total };
};

// @route GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  res.json(await buildCartResponse(cart));
});

// @route POST /api/cart/items
export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const qty = Math.max(1, parseInt(quantity, 10) || 1);

  const product = await Product.findById(productId);
  if (!product || !product.isActive || !product.isPublished) {
    res.status(404);
    throw new Error('Product not available');
  }

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find((i) => String(i.product) === String(productId));
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.items.push({ product: product._id, seller: product.seller, quantity: qty });
  }
  await cart.save();

  res.status(201).json(await buildCartResponse(cart));
});

// @route PUT /api/cart/items/:productId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const qty = parseInt(quantity, 10);

  const cart = await getOrCreateCart(req.user._id);
  const idx = cart.items.findIndex((i) => String(i.product) === String(req.params.productId));
  if (idx === -1) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  if (!qty || qty <= 0) {
    cart.items.splice(idx, 1);
  } else {
    cart.items[idx].quantity = qty;
  }
  await cart.save();

  res.json(await buildCartResponse(cart));
});

// @route DELETE /api/cart/items/:productId
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => String(i.product) !== String(req.params.productId));
  await cart.save();
  res.json(await buildCartResponse(cart));
});
