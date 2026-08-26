import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { value: 'dresses', label: 'Dresses' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'bags', label: 'Bags' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'beauty', label: 'Beauty' },
];

const CategoryBrowse = () => (
  <section className="mx-auto max-w-7xl px-6 pt-16">
    <h2 className="font-display text-2xl font-semibold text-ink-900">Browse the Catalog</h2>
    <div className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-6">
      {CATEGORIES.map((c, i) => (
        <motion.div
          key={c.value}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
        >
          <Link
            to={`/catalog?category=${c.value}`}
            className="flex flex-col items-center justify-center rounded-2xl border border-line-200 bg-white py-7 text-center transition hover:-translate-y-1 hover:border-rose-300 hover:shadow-md"
          >
            <span className="font-display text-sm text-ink-900">{c.label}</span>
          </Link>
        </motion.div>
      ))}
    </div>
  </section>
);

export default CategoryBrowse;
