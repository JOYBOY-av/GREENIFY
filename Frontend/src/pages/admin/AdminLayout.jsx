import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  Leaf, 
  FileText, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/users',     label: 'Users',        icon: Users },
  { to: '/admin/badges',    label: 'Badges',       icon: Trophy },
  { to: '/admin/actions',   label: 'Actions',      icon: Leaf },
  { to: '/admin/legal',     label: 'Legal Pages',  icon: FileText },
];

export default function AdminLayout({ children }) {
  const { adminUser, adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">

      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-20">

        <Link to="/" className="flex items-center gap-3 px-6 py-6 border-b border-gray-800 hover:bg-gray-800/50 transition-colors group">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-900/50 group-hover:scale-110 transition-transform">
            <Leaf size={20} />
          </div>
          <div>
            <div className="text-white font-black text-sm">Greenify</div>
            <div className="text-emerald-400 text-xs font-semibold tracking-widest uppercase">Admin</div>
          </div>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <ExternalLink size={18} />
              Go to Website
            </NavLink>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800 mb-3">
            <div className="w-8 h-8 bg-emerald-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {adminUser?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{adminUser?.name || 'Admin'}</p>
              <p className="text-emerald-400 text-xs">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen bg-gray-950">
        {children}
      </main>
    </div>
  );
}
