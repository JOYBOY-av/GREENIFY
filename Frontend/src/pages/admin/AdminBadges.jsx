import { useEffect, useState } from 'react';
import adminApi from '../../api/admin';
import AdminLayout from './AdminLayout';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const EMPTY = { name: '', description: '', icon: '', criteria: '', category: 'general', level: 1 };

function BadgeModal({ badge, onClose, onSave }) {
  const [form, setForm] = useState(badge || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-7 max-w-md w-full shadow-2xl">
        <h2 className="text-white font-bold text-lg mb-5">{badge ? 'Edit Badge' : 'New Badge'}</h2>
        {error && <div className="mb-4 text-red-400 text-sm bg-red-900/20 border border-red-700/40 rounded-xl p-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs font-semibold mb-1 block">Icon</label>
              <input value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-semibold mb-1 block">Level</label>
              <input type="number" min={1} value={form.level} onChange={e => setForm({...form, level: parseInt(e.target.value)})} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Name *</label>
            <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Category</label>
            <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="general, recycling, energy…" className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-gray-400 text-xs font-semibold mb-1 block">Criteria *</label>
            <input required value={form.criteria} onChange={e => setForm({...form, criteria: e.target.value})} placeholder="total_points >= 100" className="w-full bg-gray-800 border border-gray-700 text-white font-mono text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <p className="text-gray-600 text-xs mt-1">Variables: total_points, total_actions, recycle_count, energy_count…</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm font-semibold transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition disabled:opacity-60">{saving ? 'Saving…' : 'Save Badge'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminBadges() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    adminApi.get('/admin/badges').then(r => { setBadges(r.data); setLoading(false); });
  };
  useEffect(() => { load(); }, []);

  const handleSave = async (form) => {
    if (form.id) {
      const res = await adminApi.put(`/admin/badges/${form.id}`, form);
      setBadges(b => b.map(x => x.id === form.id ? res.data : x));
    } else {
      const res = await adminApi.post('/admin/badges', form);
      setBadges(b => [...b, res.data]);
    }
  };

  const handleDelete = async () => {
    await adminApi.delete(`/admin/badges/${deleteId}`);
    setBadges(b => b.filter(x => x.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-white">Badges</h1>
            <p className="text-gray-500 mt-1">{badges.length} badges defined</p>
          </div>
          <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-900/30">
            <Plus size={18} />
            New Badge
          </button>
        </div>

        {loading ? <div className="text-gray-400">Loading...</div> : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-4">Badge</th>
                  <th className="text-left px-5 py-4">Category</th>
                  <th className="text-left px-5 py-4">Level</th>
                  <th className="text-left px-5 py-4">Criteria</th>
                  <th className="text-left px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {badges.map(b => (
                  <tr key={b.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-xl shrink-0">
                          {b.icon}
                        </div>
                        <div>
                          <div className="text-white font-semibold">{b.name}</div>
                          <div className="text-gray-500 text-xs line-clamp-1">{b.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 capitalize">{b.category || '—'}</td>
                    <td className="px-5 py-4 text-gray-400">{b.level ?? '—'}</td>
                    <td className="px-5 py-4 font-mono text-xs text-emerald-400">{b.criteria}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => setModal(b)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 transition">
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button onClick={() => setDeleteId(b.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-900/30 text-red-400 hover:bg-red-800/50 transition">
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {badges.length === 0 && <tr><td colSpan={5} className="text-center text-gray-600 py-10">No badges yet</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && <BadgeModal badge={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={handleSave} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-7 max-w-sm w-full">
            <p className="text-white font-semibold mb-5">Delete this badge? This also removes it from users who earned it.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-800 text-sm font-semibold">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
