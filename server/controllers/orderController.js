import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import SubOrder from '../models/SubOrder.js';
import razorpay, { isRazorpayConfigured } from '../config/razorpay.js';

const REQUIRED_ADDRESS_FIELDS = ['fullName', 'line1', 'city', 'state', 'postalCode', 'phone'];

// @route POST /api/orders  (buyer, verified) — creates a pending order from the cart
export const createOrder = asyncHandler(async (req, res) => {
  if (!isRazorpayConfigured()) {
    res.status(503);
    throw new Error(
      'Payments are not configured yet. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env.'
    );
  }

  const { shippingAddress } = req.body;
  const missing = REQUIRED_ADDRESS_FIELDS.filter((f) => !shippingAddress?.[f]);
  if (missing.length) {
    res.status(400);
    throw new Error(`Missing shipping address fields: ${missing.join(', ')}`);
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const productIds = cart.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const unavailable = [];
  const bySeller = new Map();

  for (const item of cart.items) {
    const product = productMap.get(String(item.product));
    if (!product || !product.isActive || !product.isPublished || product.stock < item.quantity) {
      unavailable.push({ productId: item.product, reason: !product ? 'removed' : !product.isActive || !product.isPublished ? 'unavailable' : 'insufficient stock' });
      continue;
    }
    const sellerId = String(product.seller);
    if (!bySeller.has(sellerId)) {
      bySeller.set(sellerId, { seller: product.seller, storeName: product.storeName, items: [], subtotal: 0 });
    }
    const group = bySeller.get(sellerId);
    const lineItem = {
      product: product._id,
      title: product.title,
      image: product.images?.[0]?.url,
      price: product.price,
      quantity: item.quantity,
    };
    group.items.push(lineItem);
    group.subtotal += product.price * item.quantity;
  }

  if (unavailable.length) {
    res.status(400);
    return res.json({ message: 'Some items in your cart are no longer available', unavailable });
  }

  const totalAmount = Array.from(bySeller.values()).reduce((sum, g) => sum + g.subtotal, 0);
  if (totalAmount <= 0) {
    res.status(400);
    throw new Error('Order total must be greater than zero');
  }

  const order = await Order.create({
    buyer: req.user._id,
    subOrders: [],
    totalAmount,
    currency: 'INR',
    shippingAddress,
    paymentStatus: 'created',
  });

  const subOrders = await SubOrder.insertMany(
    Array.from(bySeller.values()).map((g) => ({
      parentOrder: order._id,
      seller: g.seller,
      buyer: req.user._id,
      storeName: g.storeName,
      items: g.items,
      subtotal: g.subtotal,
      shippingAddress,
      status: 'pending_payment',
      statusHistory: [{ status: 'pending_payment' }],
    }))
  );

  order.subOrders = subOrders.map((s) => s._id);
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(totalAmount * 100),
    currency: 'INR',
    receipt: String(order._id),
  });
  order.razorpayOrderId = rpOrder.id;
  await order.save();

  res.status(201).json({
    mongoOrderId: order._id,
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    prefill: { name: req.user.name, email: req.user.email, contact: req.user.phone || '' },
  });
});

// @route POST /api/orders/verify  (buyer)
export const verifyPayment = asyncHandler(async (req, res) => {
  const { mongoOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const order = await Order.findById(mongoOrderId);
  if (!order || String(order.buyer) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.paymentStatus === 'paid') {
    const populated = await Order.findById(order._id).populate('subOrders');
    return res.json({ order: populated });
  }

  if (order.razorpayOrderId !== razorpay_order_id) {
    res.status(400);
    throw new Error('Order mismatch');
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  const valid =
    expectedSignature.length === razorpay_signature?.length &&
    crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature));

  if (!valid) {
    order.paymentStatus = 'failed';
    await order.save();
    res.status(400);
    throw new Error('Payment verification failed');
  }

  order.paymentStatus = 'paid';
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  const subOrders = await SubOrder.find({ parentOrder: order._id });
  await SubOrder.updateMany(
    { parentOrder: order._id },
    { $set: { status: 'placed' }, $push: { statusHistory: { status: 'placed' } } }
  );

  const bulkOps = subOrders.flatMap((so) =>
    so.items.map((item) => ({
      updateOne: {
        filter: { _id: item.product, stock: { $gte: item.quantity } },
        update: { $inc: { stock: -item.quantity } },
      },
    }))
  );
  if (bulkOps.length) await Product.bulkWrite(bulkOps);

  await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });

  const populated = await Order.findById(order._id).populate('subOrders');
  res.json({ order: populated });
});

// @route GET /api/orders  (buyer)
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate('subOrders');
  res.json({ items: orders });
});

// @route GET /api/orders/:id  (buyer, owner only)
export const getMyOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('subOrders');
  if (!order || String(order.buyer) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json({ order });
});
