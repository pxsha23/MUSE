import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createOrder, verifyPayment } from '../api/orderApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const EMPTY_ADDRESS = { fullName: '', line1: '', line2: '', city: '', state: '', postalCode: '', phone: '' };

const Checkout = () => {
  const { cart, refresh } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, fullName: user?.name || '', phone: user?.phone || '' });
  const [placing, setPlacing] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const order = await createOrder(address);

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Could not load payment gateway. Check your connection and try again.');
        return;
      }

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: 'MUSE',
        description: 'MUSE order',
        prefill: order.prefill,
        theme: { color: '#c13b6a' },
        handler: async (response) => {
          try {
            const result = await verifyPayment({
              mongoOrderId: order.mongoOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            await refresh();
            toast.success('Payment successful!');
            navigate(`/orders/${result.order._id}`);
          } catch (err) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => toast('Payment cancelled', { icon: 'ℹ️' }),
        },
      });

      razorpay.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      razorpay.open();
    } catch (err) {
      if (err.response?.data?.unavailable) {
        toast.error('Some items in your cart are no longer available. Please review your cart.');
        navigate('/cart');
      } else {
        toast.error(err.response?.data?.message || 'Could not start checkout');
      }
    } finally {
      setPlacing(false);
    }
  };

  const field = (key, label, extra = {}) => (
    <div>
      <label className="mb-1 block text-xs font-medium text-ink-900/60">{label}</label>
      <input
        required
        value={address[key]}
        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
        className="w-full rounded-xl border border-blush-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-rose-400"
        {...extra}
      />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-ink-900">Checkout</h1>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handlePay} className="space-y-4 lg:col-span-2">
          <h2 className="text-sm font-semibold text-ink-900">Shipping Address</h2>
          {field('fullName', 'Full name')}
          {field('line1', 'Address line 1')}
          {field('line2', 'Address line 2 (optional)', { required: false })}
          <div className="grid grid-cols-2 gap-4">
            {field('city', 'City')}
            {field('state', 'State')}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {field('postalCode', 'Postal code')}
            {field('phone', 'Phone', { type: 'tel' })}
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
          >
            {placing ? 'Preparing payment…' : `Pay ${formatPrice(cart.total)}`}
          </button>
        </form>

        <div className="h-fit rounded-2xl border border-blush-200 bg-white p-6">
          <h2 className="font-semibold text-ink-900">Order Summary</h2>
          {cart.sellers.map((s) => (
            <div key={s.seller} className="mt-3 flex justify-between text-sm text-ink-900/70">
              <span>{s.storeName}</span>
              <span>{formatPrice(s.subtotal)}</span>
            </div>
          ))}
          <div className="mt-4 flex justify-between border-t border-blush-100 pt-3 text-base font-semibold text-ink-900">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
