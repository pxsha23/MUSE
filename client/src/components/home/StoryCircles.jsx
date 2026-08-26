import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchStoryFeed } from '../../api/storyApi';
import StoryViewer from './StoryViewer';

const StoryCircles = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchStoryFeed()
      .then((data) => setFeed(data.feed))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && feed.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pt-14">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-ink-900">Shop the Trend</h2>
        <span className="text-xs font-medium uppercase tracking-widest text-ink-900/40">
          Tap to watch
        </span>
      </div>

      <div className="no-scrollbar mt-5 flex gap-5 overflow-x-auto pb-2">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex w-20 shrink-0 flex-col items-center gap-2">
                <div className="h-20 w-20 animate-pulse rounded-full bg-blush-200" />
                <div className="h-3 w-14 animate-pulse rounded bg-blush-200" />
              </div>
            ))
          : feed.map((entry, i) => (
              <motion.button
                key={entry.seller.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setOpenIndex(i)}
                className="flex w-20 shrink-0 flex-col items-center gap-2 text-center"
              >
                <span className="rounded-full border-2 border-rose-400 p-[3px]">
                  <span className="block h-[72px] w-[72px] overflow-hidden rounded-full bg-blush-100">
                    {entry.seller.storeLogoUrl ? (
                      <img
                        src={entry.seller.storeLogoUrl}
                        alt={entry.seller.storeName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center font-display text-lg text-rose-600">
                        {entry.seller.storeName?.[0]}
                      </span>
                    )}
                  </span>
                </span>
                <span className="line-clamp-1 text-xs font-medium text-ink-900/80">
                  {entry.seller.storeName}
                </span>
              </motion.button>
            ))}
      </div>

      {openIndex !== null && (
        <StoryViewer feed={feed} startSellerIndex={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </section>
  );
};

export default StoryCircles;
