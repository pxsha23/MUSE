import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardSidebar from '../../components/seller/DashboardSidebar';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold text-ink-900">Seller Dashboard</h1>

      {!user.emailVerified && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Verify your email to publish products live or post stories.{' '}
          <Link to="/verify-email" className="font-semibold underline">Verify now</Link>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <DashboardSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
