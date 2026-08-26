import { NavLink } from 'react-router-dom';
import { FiBox, FiPackage, FiFilm, FiUser } from 'react-icons/fi';

const LINKS = [
  { to: '/seller/products', label: 'Products', icon: FiBox },
  { to: '/seller/orders', label: 'Orders', icon: FiPackage },
  { to: '/seller/stories', label: 'Stories', icon: FiFilm },
  { to: '/seller/profile', label: 'Store Profile', icon: FiUser },
];

const DashboardSidebar = () => (
  <nav className="flex gap-2 overflow-x-auto border-b border-blush-200 pb-3 lg:w-56 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
    {LINKS.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
            isActive ? 'bg-rose-600 text-white' : 'text-ink-900/70 hover:bg-blush-100'
          }`
        }
      >
        <Icon size={16} /> {label}
      </NavLink>
    ))}
  </nav>
);

export default DashboardSidebar;
