import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
    <h1 className="font-display text-4xl font-bold text-ink-900">404</h1>
    <p className="mt-2 text-sm text-ink-900/60">This page doesn't exist.</p>
    <Link to="/" className="mt-6 rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
