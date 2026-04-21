import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    logout();
    navigate('/');
    setShowLogoutModal(false);
  };

  const navLinks = user
    ? [
        { to: '/', label: 'Home' },
        { to: '/dashboard', label: 'Dashboard' },
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
      return base + 'bg-green-50 text-green-700 font-semibold';
    }
    return base + 'text-gray-500 hover:text-green-600 hover:bg-green-50/60';
  };

  return (
    <>

      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-4xl mb-4">👋</div>
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

      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
              <img src="/logo.png" alt="Greenify" className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl text-green-600 tracking-tight">Greenify</span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to} className={linkClass(to)}>
                  {label}
                  {isActive(to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5 bg-green-500 rounded-full" />
                  )}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="w-px h-5 bg-gray-200 mx-2" />
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* <div className="w-px h-5 bg-gray-200 mx-2" />
                  <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-green-600 transition px-2 py-1.5">Log in</Link>
                  <Link to="/register" className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition shadow-sm ml-1">
                    Sign up
                  </Link> */}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
