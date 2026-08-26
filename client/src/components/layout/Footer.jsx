import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    e.target.reset();
    toast.success("You're on the list — thank you!");
  };

  return (
    <footer className="mt-20 bg-ink-900 text-blush-100">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <h3 className="font-display text-2xl font-bold text-white">MUSE</h3>
            <p className="mt-3 max-w-xs text-sm text-blush-100/70">
              One cart for every small, independent brand you love. Discover a look,
              shop it whole — no more juggling ten different DMs.
            </p>
            <div className="mt-4 flex gap-4 text-blush-100/80">
              <a href="#" aria-label="Instagram" className="hover:text-white"><FiInstagram size={18} /></a>
              <a href="#" aria-label="Facebook" className="hover:text-white"><FiFacebook size={18} /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><FiTwitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Shop</h4>
            <ul className="mt-3 space-y-2 text-sm text-blush-100/70">
              <li><Link to="/catalog" className="hover:text-white">All Categories</Link></li>
              <li><Link to="/catalog?category=dresses" className="hover:text-white">Dresses</Link></li>
              <li><Link to="/catalog?category=jewelry" className="hover:text-white">Jewelry</Link></li>
              <li><Link to="/catalog?category=shoes" className="hover:text-white">Shoes</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Sell</h4>
            <ul className="mt-3 space-y-2 text-sm text-blush-100/70">
              <li><Link to="/register" className="hover:text-white">Become a Seller</Link></li>
              <li><Link to="/login" className="hover:text-white">Seller Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white">Help</h4>
            <ul className="mt-3 space-y-2 text-sm text-blush-100/70">
              <li><Link to="/orders" className="hover:text-white">Track an Order</Link></li>
              <li><Link to="/#why-muse" className="hover:text-white">Why MUSE</Link></li>
              <li><Link to="/" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-sm font-semibold text-white">Stay in the loop</h4>
            <p className="mt-3 text-sm text-blush-100/70">New sellers, new looks, first.</p>
            <form onSubmit={handleSubscribe} className="mt-3 flex gap-2">
              <input
                type="email"
                required
                placeholder="Your email"
                className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-blush-100/40 outline-none focus:border-rose-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-blush-100/50 sm:flex-row">
          <p>© {new Date().getFullYear()} MUSE. All rights reserved.</p>
          <p>Secure checkout powered by Razorpay</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
