import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset/forgot-password', { email });
      toast.success('OTP sent to your email (if it exists)');
      setStep(2);
    } catch (err) {
      toast.error('Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset/verify-otp', { email, otp });
      toast.success('OTP verified!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/reset/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error('Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 animate-bloom opacity-0">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl border border-gray-100 sm:px-10">
          
          {step === 1 && (
            <form className="space-y-6 animate-fade-in-up" onSubmit={handleRequestOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter your Email</label>
                <div className="mt-1">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form className="space-y-6 animate-fade-in-up" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter 6-digit OTP</label>
                <div className="mt-1">
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 tracking-widest text-center text-lg" maxLength="6" />
                </div>
                <p className="mt-2 text-xs text-gray-500 text-center">Check your email ({email})</p>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>
          )}

          {step === 3 && (
            <form className="space-y-6 animate-fade-in-up" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1">
                  <input type="password" required minLength="6" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full py-2.5 px-4 rounded-lg text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
                {loading ? 'Resetting...' : 'Set New Password'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-green-600 hover:text-green-500 font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
