import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiChevronLeft, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const IMAGE_DURATION_MS = 5000;

const StoryViewer = ({ feed, startSellerIndex, onClose }) => {
  const [sellerIndex, setSellerIndex] = useState(startSellerIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const rafRef = useRef(null);

  const seller = feed[sellerIndex];
  const story = seller?.stories[storyIndex];

  const goToSeller = (delta) => {
    const next = sellerIndex + delta;
    if (next < 0) return;
    if (next >= feed.length) return onClose();
    setSellerIndex(next);
    setStoryIndex(delta > 0 ? 0 : feed[next].stories.length - 1);
    setProgress(0);
  };

  const advance = () => {
    if (storyIndex < seller.stories.length - 1) {
      setStoryIndex((i) => i + 1);
      setProgress(0);
    } else {
      goToSeller(1);
    }
  };

  const rewind = () => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      setProgress(0);
    } else {
      goToSeller(-1);
    }
  };

  useEffect(() => {
    setProgress(0);
    if (!story) return;
    if (story.mediaType === 'video') return;

    const start = performance.now();
    const tick = (now) => {
      const pct = Math.min(100, ((now - start) / IMAGE_DURATION_MS) * 100);
      setProgress(pct);
      if (pct >= 100) advance();
      else rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerIndex, storyIndex]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') advance();
      if (e.key === 'ArrowLeft') rewind();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerIndex, storyIndex]);

  if (!seller || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-6">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 text-white/80 hover:text-white"
        aria-label="Close"
      >
        <FiX size={28} />
      </button>

      <button
        onClick={() => goToSeller(-1)}
        className="absolute left-2 z-20 hidden text-white/60 hover:text-white sm:block"
        aria-label="Previous"
      >
        <FiChevronLeft size={32} />
      </button>
      <button
        onClick={() => goToSeller(1)}
        className="absolute right-2 z-20 hidden text-white/60 hover:text-white sm:block"
        aria-label="Next"
      >
        <FiChevronRight size={32} />
      </button>

      <div className="relative aspect-9/16 h-full max-h-[85vh] w-full max-w-sm overflow-hidden rounded-2xl bg-ink-900">
        <div className="absolute inset-x-0 top-0 z-10 flex gap-1 p-2">
          {seller.stories.map((_, i) => (
            <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full bg-white transition-[width] duration-100 ease-linear"
                style={{
                  width: i < storyIndex ? '100%' : i === storyIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 top-4 z-10 flex items-center gap-2 px-3 pt-2">
          <div className="h-8 w-8 overflow-hidden rounded-full border border-white/50 bg-white/20">
            {seller.storeLogoUrl && (
              <img src={seller.storeLogoUrl} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <Link
            to={`/store/${seller.storeSlug}`}
            className="text-sm font-semibold text-white hover:underline"
          >
            {seller.storeName}
          </Link>
        </div>

        {story.mediaType === 'video' ? (
          <video
            ref={videoRef}
            src={story.mediaUrl}
            autoPlay
            playsInline
            onEnded={advance}
            className="h-full w-full object-cover"
          />
        ) : (
          <img src={story.mediaUrl} alt={story.caption || ''} className="h-full w-full object-cover" />
        )}

        <button
          onClick={rewind}
          className="absolute inset-y-0 left-0 w-1/3 sm:hidden"
          aria-label="Previous story"
        />
        <button
          onClick={advance}
          className="absolute inset-y-0 right-0 w-1/3 sm:hidden"
          aria-label="Next story"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 to-transparent p-4">
          {story.caption && <p className="mb-3 text-sm text-white/90">{story.caption}</p>}
          {story.linkedProduct && (
            <Link
              to={`/product/${story.linkedProduct}`}
              className="flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-900 shadow-lg"
            >
              <FiShoppingBag /> Shop this
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
