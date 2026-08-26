import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { fetchSellerOrders, updateSellerOrderStatus } from '../../api/sellerApi';
import { formatPrice } from '../../utils/format';
import { SUB_ORDER_STATUS_LABELS, SUB_ORDER_STATUS_FLOW } from '../../utils/constants';
import Spinner from '../../components/common/Spinner';
import Dropdown from '../../components/common/Dropdown';

const SellerOrderRow = ({ order, onUpdated }) => {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [carrier, setCarrier] = useState(order.carrier || '');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const { subOrder } = await updateSellerOrderStatus(order._id, {
        status,
        trackingNumber: tracking,
        carrier,
      });
      onUpdated(subOrder);
      toast.success('Order updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update order');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blush-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-ink-900/40">
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-sm font-semibold text-ink-900">
            {order.buyer?.name} · {formatPrice(order.subtotal)}
          </p>
        </div>
        <span className="rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-rose-700">
          {SUB_ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="mt-3 divide-y divide-blush-100">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 py-2 text-sm">
            {item.image && <img src={item.image} alt="" className="h-12 w-10 rounded-md object-cover" />}
            <span className="flex-1 text-ink-900/80">{item.title}</span>
            <span className="text-ink-900/50">×{item.quantity}</span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-ink-900/50">
        Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode} · {order.shippingAddress.phone}
      </p>

      {order.status !== 'pending_payment' && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Dropdown
            value={status}
            onChange={setStatus}
            className="w-44"
            options={SUB_ORDER_STATUS_FLOW.concat('cancelled').map((s) => ({
              value: s,
              label: SUB_ORDER_STATUS_LABELS[s],
            }))}
          />
          <input
            placeholder="Tracking number"
            value={tracking}
            onChange={(e) => setTracking(e.target.value)}
            className="rounded-xl border border-line-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-500"
          />
          <input
            placeholder="Carrier"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-28 rounded-xl border border-line-200 bg-white px-3 py-2 text-xs outline-none focus:border-rose-500"
          />
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Update'}
          </button>
        </div>
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerOrders()
      .then((data) => setOrders(data.items))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdated = (updated) => {
    setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-ink-900">Orders</h2>
      {orders.length === 0 ? (
        <p className="mt-10 text-sm text-ink-900/50">No orders yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((o) => (
            <SellerOrderRow key={o._id} order={o} onUpdated={handleUpdated} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
