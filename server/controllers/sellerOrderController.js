import { asyncHandler } from '../utils/asyncHandler.js';
import SubOrder from '../models/SubOrder.js';
import { SUB_ORDER_STATUSES } from '../utils/constants.js';

// @route GET /api/seller/orders  (seller — only their own sub-orders)
export const getSellerOrders = asyncHandler(async (req, res) => {
  const subOrders = await SubOrder.find({ seller: req.user._id })
    .sort({ createdAt: -1 })
    .populate('buyer', 'name email phone');
  res.json({ items: subOrders });
});

// @route GET /api/seller/orders/:id  (seller, owner only)
export const getSellerOrderById = asyncHandler(async (req, res) => {
  const subOrder = await SubOrder.findById(req.params.id).populate('buyer', 'name email phone');
  if (!subOrder || String(subOrder.seller) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json({ subOrder });
});

// @route PUT /api/seller/orders/:id/status  (seller, owner only)
export const updateSellerOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber, carrier } = req.body;

  if (!SUB_ORDER_STATUSES.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const subOrder = await SubOrder.findById(req.params.id);
  if (!subOrder || String(subOrder.seller) !== String(req.user._id)) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (subOrder.status === 'pending_payment') {
    res.status(400);
    throw new Error('This order has not been paid for yet');
  }

  subOrder.status = status;
  if (trackingNumber !== undefined) subOrder.trackingNumber = trackingNumber;
  if (carrier !== undefined) subOrder.carrier = carrier;
  subOrder.statusHistory.push({ status });
  await subOrder.save();

  res.json({ subOrder });
});
