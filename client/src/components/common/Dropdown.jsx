import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const Dropdown = ({ value, onChange, options, className = '' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-line-200 bg-white py-2.5 pl-4 pr-3.5 text-sm text-ink-900 transition hover:border-rose-300"
      >
        <span className="truncate">{current?.label}</span>
        <FiChevronDown
          size={15}
          className={`shrink-0 text-ink-900/40 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-[calc(100%+6px)] z-20 w-full min-w-[10rem] overflow-hidden rounded-xl border border-line-200 bg-white py-1.5 shadow-lg"
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition hover:bg-blush-50 ${
                  o.value === value ? 'text-rose-700' : 'text-ink-900'
                }`}
              >
                {o.label}
                {o.value === value && <FiCheck size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
