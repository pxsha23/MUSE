import mongoose from 'mongoose';
import { SUB_ORDER_STATUSES } from '../utils/constants.js';

const subOrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const subOrderSchema = new mongoose.Schema(
  {
    parentOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    storeName: { type: String, required: true },
    items: [subOrderItemSchema],
    subtotal: { type: Number, required: true },

    shippingAddress: { type: shippingAddressSchema, required: true },

    status: {
      type: String,
      enum: SUB_ORDER_STATUSES,
      default: 'pending_payment',
    },
    trackingNumber: { type: String, default: '' },
    carrier: { type: String, default: '' },
    statusHistory: [
      {
        status: { type: String, enum: SUB_ORDER_STATUSES },
        changedAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const SubOrder = mongoose.model('SubOrder', subOrderSchema);
export default SubOrder;
