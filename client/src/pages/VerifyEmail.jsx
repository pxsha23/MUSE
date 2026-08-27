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
        <button
          type="button"
          onClick={() => {
            setCode(devOtp);
            toast.success('Code filled in');
          }}
          className="mt-5 flex w-full items-center justify-between rounded-xl border border-line-200 bg-blush-50 px-4 py-2.5 text-left"
        >
          <span className="text-xs text-ink-900/50">Didn't get the email? Use</span>
          <span className="font-display text-base font-semibold tracking-[0.2em] text-rose-700">{devOtp}</span>
        </button>
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
