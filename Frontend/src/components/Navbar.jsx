import { useContext, useState, useEffect } from 'react';
import { LogOut, Plus, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const navLinks = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
        ...(user.role === 'admin' ? [{ to: '/admin/dashboard', label: 'Admin Panel' }] : []),
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/badges', label: 'Badges' },
      ]
    : [
        { to: '/', label: 'Home' },
        { to: '/learn-more', label: 'About Us' },
      ];

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => {
    const base = 'relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ';
    if (isActive(path)) {
      return base + 'bg-emerald-600 text-white font-semibold shadow-sm';
    }
    return base + 'text-emerald-800 hover:text-emerald-900 hover:bg-emerald-200/50';
  };

  return (
    <>
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center border border-emerald-100"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-emerald-600 mb-4 flex justify-center">
              <LogOut size={48} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Logging out?</h2>
            <p className="text-gray-500 text-sm mb-6">You'll need to sign back in to access your dashboard and track your eco-actions.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
              >
                Stay
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-semibold hover:bg-red-600 transition text-sm"
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-emerald-50/90 backdrop-blur-md shadow-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
              <img src="/logo.png" alt="Greenify" className="h-14 w-14 object-contain rounded-lg" />
              <span className="font-bold text-2xl text-emerald-800 tracking-tight">Greenify</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={linkClass(to)}>
                  {label}
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-emerald-600 rounded-full" />
                  )}
                </Link>
              ))}

              {user && (
                <Link
                  to="/log-action"
                  className="ml-2 bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-emerald-700 transition shadow-sm flex items-center gap-1.5"
                >
                  <Plus size={16} strokeWidth={3} />
                  <span>Log Action</span>
                </Link>
              )}

              {user ? (
                <>
                  <div className="w-px h-5 bg-emerald-200 mx-2" />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-sm font-medium text-emerald-600 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>

            <div className="flex md:hidden items-center gap-2">
              {user && (
                <Link
                  to="/log-action"
                  className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition shadow-sm"
                >
                  <Plus size={20} strokeWidth={3} />
                </Link>
              )}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 rounded-lg transition"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 bg-white">
            <div className="px-4 py-3 flex flex-col gap-2 shadow-xl rounded-b-xl">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-3 rounded-xl text-base font-medium transition ${
                    isActive(to) ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition mt-2 border-t border-emerald-50"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
