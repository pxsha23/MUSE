import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PiDressThin, PiHighHeelThin, PiHandbagThin, PiFlowerTulipThin, PiCloudThin } from 'react-icons/pi';
import { GiLipstick } from 'react-icons/gi';
import { RiDiamondRingLine } from 'react-icons/ri';

const FLOATERS = [
  { Icon: PiFlowerTulipThin, className: 'left-[4%] top-[14%]', size: 60, delay: 0 },
  { Icon: RiDiamondRingLine, className: 'left-[13%] top-[62%]', size: 52, delay: 0.8 },
  { Icon: PiDressThin, className: 'right-[6%] top-[10%]', size: 68, delay: 0.4 },
  { Icon: GiLipstick, className: 'right-[14%] top-[58%]', size: 50, delay: 1.2 },
  { Icon: PiHighHeelThin, className: 'left-[24%] top-[82%]', size: 48, delay: 1.6 },
  { Icon: PiHandbagThin, className: 'right-[26%] top-[80%]', size: 50, delay: 0.6 },
  { Icon: PiCloudThin, className: 'left-[2%] top-[42%]', size: 56, delay: 1 },
  { Icon: PiCloudThin, className: 'right-[2%] top-[38%]', size: 64, delay: 0.3 },
];

const Hero = () => (
  <section className="relative overflow-hidden bg-white">
    <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blush-100/80 blur-3xl" />

    {FLOATERS.map(({ Icon, className, size, delay }, i) => (
      <div
        key={i}
        className={`animate-float pointer-events-none absolute hidden sm:block ${className}`}
        style={{ animationDelay: `${delay}s` }}
      >
        <div
          className="glass-panel flex items-center justify-center rounded-full text-rose-400/80 shadow-sm"
          style={{ width: size, height: size }}
        >
          <Icon size={size * 0.5} />
        </div>
      </div>
    ))}

    <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-24 pt-20 text-center sm:pb-32 sm:pt-24">
      <motion.span
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-panel rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-900/60"
      >
        Complete the look
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="muse-glass-wrap mt-8"
      >
        <span
          data-text="MUSE"
          className="muse-glass-text block text-[6rem] leading-none sm:text-[10rem] lg:text-[13rem]"
        >
          MUSE
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-8 max-w-lg text-balance text-base text-ink-900/60 sm:text-lg"
      >
        Every piece here comes from a small shop somewhere, a dress from one,
        earrings from another. Your one-stop shop.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-4"
      >
        <Link
          to="/catalog"
          className="rounded-full bg-ink-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-rose-800"
        >
          Shop the Catalog
        </Link>
        <Link
          to="/studio"
          className="rounded-full border border-line-200 px-8 py-3.5 text-sm font-semibold text-ink-900 transition hover:-translate-y-0.5 hover:border-rose-300"
        >
          Try MUSE Studio
        </Link>
      </motion.div>
    </div>
  </section>
);

export default Hero;
