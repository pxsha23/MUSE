import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api/orderApi';
import { formatPrice } from '../utils/format';
import { SUB_ORDER_STATUS_LABELS } from '../utils/constants';
import Spinner from '../components/common/Spinner';

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then((data) => setOrders(data.items))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-ink-900">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-ink-900/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="block rounded-2xl border border-blush-200 bg-white p-5 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-ink-900/40">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink-900">
                    {order.subOrders.length} seller{order.subOrders.length === 1 ? '' : 's'} · {formatPrice(order.totalAmount)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    order.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : order.paymentStatus === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.subOrders.map((so) => (
                  <span key={so._id} className="rounded-full bg-blush-100 px-3 py-1 text-xs text-ink-900/70">
                    {so.storeName}: {SUB_ORDER_STATUS_LABELS[so.status]}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerOrders;
