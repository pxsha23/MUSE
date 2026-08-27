import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { verifyOtp as verifyOtpApi, resendOtp as resendOtpApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import OtpInput from '../components/common/OtpInput';

const VerifyEmail = () => {
  const { user, setVerified } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [code, setCode] = useState('');
  const [devOtp, setDevOtp] = useState(location.state?.devOtp || null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (user?.emailVerified) {
      navigate(user.role === 'seller' ? '/seller/products' : '/account');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error('Enter the 6-digit code');
    setLoading(true);
    try {
      await verifyOtpApi(code);
      setVerified();
      toast.success('Email verified!');
      navigate(user?.role === 'seller' ? '/seller/products' : '/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setDevOtp(null);
    try {
      const { devOtp: newDevOtp } = await resendOtpApi();
      setCooldown(60);
      if (newDevOtp) {
        setDevOtp(newDevOtp);
      } else {
        toast.success('A new code has been sent to your email');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not resend code');
    } finally {
      setResending(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-ink-900">Verify your email</h1>
      <p className="mt-2 text-sm text-ink-900/60">
        We sent a 6-digit code to <span className="font-medium text-ink-900">{user.email}</span>
      </p>

      {devOtp && (
        <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
            Email not confirmed sent — use this code instead
          </p>
          <button
            type="button"
            onClick={() => {
              setCode(devOtp);
              toast.success('Code filled in');
            }}
            className="mt-1 font-display text-2xl font-bold tracking-[0.3em] text-rose-800"
          >
            {devOtp}
          </button>
          <p className="mt-1 text-[11px] text-rose-700/70">Tap the code to fill it in below</p>
        </div>
      )}

      <form onSubmit={handleVerify} className="mt-8 space-y-6">
        <OtpInput value={code} onChange={setCode} />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-rose-600 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? 'Verifying…' : 'Verify Email'}
        </button>
      </form>

      <button
        onClick={handleResend}
        disabled={cooldown > 0 || resending}
        className="mt-5 text-sm font-medium text-rose-600 hover:underline disabled:text-ink-900/30"
      >
        {resending ? 'Sending…' : cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
      </button>

      <p className="mt-8 text-xs text-ink-900/40">
        You can keep browsing MUSE while unverified — you'll just need to verify before
        checking out or publishing a listing.
      </p>
    </div>
  );
};

export default VerifyEmail;
