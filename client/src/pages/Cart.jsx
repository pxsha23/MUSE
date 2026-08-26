import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/format';

const Cart = () => {
  const { cart, changeQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasItems = cart.sellers.some((s) => s.items.length > 0);

  const handleCheckout = () => {
    if (!user.emailVerified) {
      toast.error('Verify your email before checking out');
      return navigate('/verify-email');
    }
    navigate('/checkout');
  };

  if (!hasItems) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink-900/55">Add pieces from any MUSE seller to get started.</p>
        <Link
          to="/catalog"
          className="mt-6 inline-block rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
        >
          Browse the Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-ink-900">Your Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.sellers.map((seller, si) => (
            <div key={seller.seller} className={si > 0 ? 'mt-8 border-t border-line-200 pt-8' : ''}>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-900/45">
                {seller.storeName}
              </p>
              <div className="mt-4 divide-y divide-line-200">
                {seller.items.map((item) => (
                  <div key={item.product} className="flex items-start gap-5 py-5">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-24 w-20 shrink-0 rounded-md border border-line-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-display text-base text-ink-900">{item.title}</p>
                        <button
                          onClick={() => removeItem(item.product)}
                          className="shrink-0 text-ink-900/35 hover:text-rose-700"
                          aria-label="Remove"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                      {!item.available && (
                        <p className="mt-1 text-xs font-medium text-rose-700">No longer available</p>
                      )}
                      <p className="mt-1 text-sm text-ink-900/50">{formatPrice(item.price)}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center border border-line-200">
                          <button
                            onClick={() => changeQuantity(item.product, item.quantity - 1)}
                            className="h-7 w-7 text-sm text-ink-900/60 hover:bg-blush-50"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                          <button
                            onClick={() => changeQuantity(item.product, Math.min(item.stock, item.quantity + 1))}
                            className="h-7 w-7 text-sm text-ink-900/60 hover:bg-blush-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-ink-900">{formatPrice(item.lineTotal)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-end text-xs text-ink-900/45">
                Subtotal from {seller.storeName}: <span className="ml-1 font-medium text-ink-900/70">{formatPrice(seller.subtotal)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit border border-line-200 p-6">
          <h2 className="font-display text-lg text-ink-900">Order Summary</h2>
          <div className="mt-5 flex justify-between text-sm text-ink-900/55">
            <span>Sellers</span>
            <span>{cart.sellers.length}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-line-200 pt-3 text-base font-semibold text-ink-900">
            <span>Total</span>
            <span>{formatPrice(cart.total)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-6 w-full rounded-full bg-ink-900 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
          >
            Checkout
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-900/40">
            One secure checkout, split and shipped by each seller.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
