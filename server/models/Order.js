import mongoose from 'mongoose';

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

const orderSchema = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    subOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubOrder' }],

    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    shippingAddress: { type: shippingAddressSchema, required: true },

    paymentStatus: {
      type: String,
      enum: ['created', 'paid', 'failed'],
      default: 'created',
    },
  },
  { timestamps: true }
);

export const ShippingAddressSchema = shippingAddressSchema;

const Order = mongoose.model('Order', orderSchema);
export default Order;
