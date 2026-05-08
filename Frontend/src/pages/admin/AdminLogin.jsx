import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import adminApi from '../../api/admin';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import PasswordField from '../../components/PasswordField';

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.post('/admin/login', form);
      adminLogin(res.data.token, res.data.admin);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-900/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">

        <Link to="/" className="block text-center mb-8 group">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg shadow-emerald-900/50 group-hover:scale-105 transition-transform">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">Greenify</h1>
          <p className="text-emerald-400 font-semibold mt-1 text-sm tracking-widest uppercase">Admin Panel</p>
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-7">Sign in to manage the platform</p>

          {error && (
            <div className="mb-5 p-3 bg-red-900/30 border border-red-700/50 text-red-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
              <input
                type="email"
                id="admin-email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@greenify.app"
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Password</label>
              <PasswordField 
                id="admin-password" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                placeholder="••••••••" 
                required 
                className="bg-gray-800 border-gray-700 text-white focus:ring-emerald-500" 
              />
            </div>
            <button
              type="submit"
              id="admin-login-btn"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/40 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-6 flex items-center justify-center gap-1.5">
            <ShieldAlert size={14} />
            Restricted access — authorised personnel only
          </p>
        </div>
      </div>
    </div>
  );
}
