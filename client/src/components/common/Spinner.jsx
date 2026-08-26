const Spinner = ({ className = '' }) => (
  <div
    className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-rose-200 border-t-rose-600 ${className}`}
    role="status"
    aria-label="Loading"
  />
);

export default Spinner;
