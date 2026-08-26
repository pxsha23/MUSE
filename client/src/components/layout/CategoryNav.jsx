import { Link } from 'react-router-dom';

export const CATEGORY_NAV = [
  { value: 'dresses', label: 'Dresses' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'beauty', label: 'Beauty' },
];

const CategoryNav = ({ className = '', onNavigate }) => (
  <nav className={className}>
    {CATEGORY_NAV.map((c) => (
      <Link
        key={c.value}
        to={`/catalog?category=${c.value}`}
        onClick={onNavigate}
        className="whitespace-nowrap text-sm font-medium text-ink-900/80 transition hover:text-rose-600"
      >
        {c.label}
      </Link>
    ))}
    <Link
      to="/catalog"
      onClick={onNavigate}
      className="whitespace-nowrap text-sm font-medium text-rose-600 hover:text-rose-700"
    >
      All Categories
    </Link>
  </nav>
);

export default CategoryNav;
