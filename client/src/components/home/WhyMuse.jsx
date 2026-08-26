import { motion } from 'framer-motion';
import { FiShoppingBag, FiFilm, FiHeart, FiShield } from 'react-icons/fi';

const REASONS = [
  {
    icon: FiShoppingBag,
    title: 'One cart, every brand',
    body: 'Add a dress from one seller and jewelry from another — pay once, at one checkout, instead of juggling ten separate payment links.',
  },
  {
    icon: FiFilm,
    title: 'Shop the way you scroll',
    body: 'Browse trending finds through video and photo stories, just like your favorite Instagram shops — tap a story, shop the product.',
  },
  {
    icon: FiHeart,
    title: 'Real, women-run shops',
    body: 'Every seller on MUSE is an independent small business. You’re not buying from a warehouse — you’re buying from the person who made it.',
  },
  {
    icon: FiShield,
    title: 'Checkout you can trust',
    body: 'Secure, verified payments and one place to track every order — no more wondering if a DM payment actually went through.',
  },
];

const WhyMuse = () => (
  <section id="why-muse" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl text-center"
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-rose-700">Why MUSE</span>
      <h2 className="font-display mt-3 text-3xl font-semibold text-ink-900 sm:text-4xl">
        Small shops deserve a big storefront
      </h2>
      <p className="mt-3 text-ink-900/55">
        MUSE brings independent aesthetic sellers together — so putting together a whole
        look is as easy as one scroll and one checkout.
      </p>
    </motion.div>

    <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {REASONS.map(({ icon: Icon, title, body }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, delay: i * 0.08 }}
          whileHover={{ y: -6 }}
          className="rounded-2xl border border-line-200 bg-white p-6 transition-shadow hover:shadow-lg"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blush-200 text-rose-700">
            <Icon size={18} />
          </div>
          <h3 className="font-display mt-4 font-semibold text-ink-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-900/55">{body}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default WhyMuse;
