import { useEffect, useState } from 'react';
import adminApi from '../../api/admin';
import AdminLayout from './AdminLayout';
import { 
  Users, 
  Trophy, 
  Leaf, 
  ClipboardList, 
  FileText 
} from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-5`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-semibold">{label}</p>
      <p className="text-white text-3xl font-black mt-0.5">{value ?? '—'}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/stats').then(r => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform-wide overview</p>
        </div>

        {loading ? (
          <div className="text-gray-400">Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard label="Total Users"          value={stats?.totalUsers}         icon={Users} color="bg-blue-900/40" />
            <StatCard label="Total Badges"         value={stats?.totalBadges}        icon={Trophy} color="bg-yellow-900/40" />
            <StatCard label="Action Types"         value={stats?.totalActionTypes}   icon={Leaf} color="bg-emerald-900/40" />
            <StatCard label="Actions Logged"       value={stats?.totalActionsLogged} icon={ClipboardList} color="bg-purple-900/40" />
          </div>
        )}

        <div className="mt-10 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-2">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Manage Users',   to: '/admin/users',   icon: Users },
              { label: 'Manage Badges',  to: '/admin/badges',  icon: Trophy },
              { label: 'Manage Actions', to: '/admin/actions', icon: Leaf },
              { label: 'Edit Legal',     to: '/admin/legal',   icon: FileText },
            ].map(({ label, to, icon: Icon }) => (
              <a
                key={to}
                href={to}
                className="flex flex-col items-center gap-2 bg-gray-800 hover:bg-gray-700 transition rounded-xl p-4 text-center"
              >
                <Icon size={24} className="text-emerald-400" />
                <span className="text-gray-300 text-sm font-semibold">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
