import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts } from '../api/productApi';
import Hero from '../components/home/Hero';
import StoryCircles from '../components/home/StoryCircles';
import CategoryBrowse from '../components/home/CategoryBrowse';
import WhyMuse from '../components/home/WhyMuse';
import ProductGrid from '../components/product/ProductGrid';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ sort: 'newest', limit: 8 })
      .then((data) => setBestsellers(data.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Hero />
      <StoryCircles />
      <CategoryBrowse />
      <WhyMuse />

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-6">
        <div className="rounded-[2rem] bg-ink-900 px-6 py-16 sm:px-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 text-center text-white"
          >
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Not sure what pairs well?</h2>
            <p className="max-w-md text-sm text-white/65">
              Like a few pieces and let MUSE Studio build the rest of the outfit for you —
              jewelry, shoes and bags, pulled from other sellers automatically.
            </p>
            <Link
              to="/studio"
              className="mt-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:bg-blush-100"
            >
              Open MUSE Studio
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold text-ink-900">Trending Now</h2>
          <Link to="/catalog" className="text-sm font-semibold text-rose-600 hover:text-rose-700">
            View all →
          </Link>
        </div>
        <div className="mt-6">
          <ProductGrid products={bestsellers} loading={loading} />
        </div>
      </section>
    </div>
  );
};

export default Home;
