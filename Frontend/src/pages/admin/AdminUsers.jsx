import { useEffect, useState } from 'react';
import adminApi from '../../api/admin';
import AdminLayout from './AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { UserPlus, UserMinus, Trash2, Search } from 'lucide-react';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-7 max-w-sm w-full shadow-2xl">
        <p className="text-white font-semibold text-base mb-5">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm font-semibold transition">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition">Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const { adminUser } = useAdmin();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminApi.get('/admin/users').then(r => {
      setUsers(r.data);
      setLoading(false);
    }).catch(() => {
      setError('Failed to load users');
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!confirm) return;
    try {
      await adminApi.delete(`/admin/users/${confirm.id}`);
      setUsers(u => u.filter(x => x.id !== confirm.id));
    } catch (err) {
      alert(err.response?.data?.msg || 'Delete failed');
    } finally {
      setConfirm(null);
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await adminApi.put(`/admin/users/${user.id}/role`, { role: newRole });
      setUsers(u => u.map(x => x.id === user.id ? { ...x, role: res.data.role } : x));
    } catch (err) {
      alert(err.response?.data?.msg || 'Role update failed');
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-white">Users</h1>
            <p className="text-gray-500 mt-1">{users.length} total users</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-2.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {loading && <div className="text-gray-400">Loading users...</div>}
        {error && <div className="text-red-400">{error}</div>}

        {!loading && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4 font-semibold">User</th>
                  <th className="text-left px-5 py-4 font-semibold">College</th>
                  <th className="text-left px-5 py-4 font-semibold">Points</th>
                  <th className="text-left px-5 py-4 font-semibold">Role</th>
                  <th className="text-left px-5 py-4 font-semibold">Joined</th>
                  <th className="text-left px-5 py-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {u.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{u.name}</div>
                          <div className="text-gray-500 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{u.college || '—'}</td>
                    <td className="px-5 py-4 text-emerald-400 font-bold">{parseInt(u.total_points)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.role === 'admin' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-gray-800 text-gray-400'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">

                        {u.id !== adminUser?.id && (
                          <button
                            onClick={() => handleRoleToggle(u)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              u.role === 'admin'
                                ? 'bg-orange-900/40 text-orange-300 hover:bg-orange-800/60'
                                : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-800/60'
                            }`}
                          >
                            {u.role === 'admin' ? <><UserMinus size={14} /> Demote</> : <><UserPlus size={14} /> Make Admin</>}
                          </button>
                        )}
                        {u.id !== adminUser?.id && (
                          <button
                            onClick={() => setConfirm({ id: u.id, name: u.name })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/30 text-red-400 hover:bg-red-800/50 transition"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                        {u.id === adminUser?.id && (
                          <span className="text-gray-600 text-xs">You</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="text-center text-gray-600 py-10">No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          message={`Delete user "${confirm.name}"? This will remove all their data.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
    </AdminLayout>
  );
}
