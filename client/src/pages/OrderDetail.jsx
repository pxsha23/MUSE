import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMyOrder } from '../api/orderApi';
import { formatPrice } from '../utils/format';
import { SUB_ORDER_STATUS_LABELS } from '../utils/constants';
import Spinner from '../components/common/Spinner';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrder(id)
      .then((data) => setOrder(data.order))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Order not found</h1>
        <Link to="/orders" className="mt-4 inline-block text-rose-600">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/orders" className="text-sm text-rose-600 hover:underline">← All orders</Link>
      <h1 className="font-display mt-2 text-3xl font-bold text-ink-900">Order Details</h1>
      <p className="mt-1 text-sm text-ink-900/50">
        Placed {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
        {order.paymentStatus === 'paid' ? 'Payment confirmed' : order.paymentStatus === 'failed' ? 'Payment failed' : 'Payment pending'}
      </p>

      <div className="mt-8 space-y-6">
        {order.subOrders.map((so) => (
          <div key={so._id} className="rounded-2xl border border-blush-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-ink-900">{so.storeName}</h2>
              <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {SUB_ORDER_STATUS_LABELS[so.status]}
              </span>
            </div>
            {so.trackingNumber && (
              <p className="mt-1 text-xs text-ink-900/50">
                Tracking: {so.trackingNumber} {so.carrier && `(${so.carrier})`}
              </p>
            )}
            <div className="mt-4 divide-y divide-blush-100">
              {so.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-3">
                  {item.image && <img src={item.image} alt={item.title} className="h-16 w-14 rounded-lg object-cover" />}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-ink-900">{item.title}</p>
                    <p className="text-xs text-ink-900/50">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold text-ink-900">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-end text-sm font-semibold text-ink-900">
              Subtotal: {formatPrice(so.subtotal)}
            </div>
          </div>
        ))}

        <div className="rounded-2xl border border-blush-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink-900">Shipping Address</h2>
          <p className="mt-2 text-sm text-ink-900/70">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.phone}
          </p>
        </div>

        <div className="flex justify-end text-lg font-semibold text-ink-900">
          Total: {formatPrice(order.totalAmount)}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
