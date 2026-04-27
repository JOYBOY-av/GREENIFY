import { useEffect, useState } from 'react';
import adminApi from '../../api/admin';
import AdminLayout from './AdminLayout';
import { FileText, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AdminLegal() {
  const [pages, setPages] = useState({ terms: null, privacy: null });
  const [activeTab, setActiveTab] = useState('terms');
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.get('/admin/legal').then(r => {
      const map = {};
      r.data.forEach(p => { map[p.slug] = p; });
      setPages(map);
      const cur = map[activeTab];
      if (cur) { setEditContent(cur.content); setEditTitle(cur.title); }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cur = pages[activeTab];
    if (cur) { setEditContent(cur.content); setEditTitle(cur.title); }
  }, [activeTab]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminApi.put(`/admin/legal/${activeTab}`, { content: editContent, title: editTitle });
      setPages(p => ({ ...p, [activeTab]: res.data }));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err.response?.data?.msg || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { slug: 'terms',   label: 'Terms of Service', icon: FileText },
    { slug: 'privacy', label: 'Privacy Policy',    icon: ShieldCheck },
  ];

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-white">Legal Pages</h1>
          <p className="text-gray-500 mt-1">Edit Terms of Service and Privacy Policy. Changes reflect on the public site instantly.</p>
        </div>

        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.slug}
              onClick={() => setActiveTab(t.slug)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                activeTab === t.slug
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white font-bold text-sm rounded-xl px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Page title"
                />
                {pages[activeTab]?.updated_at && (
                  <span className="text-gray-600 text-xs">
                    Last saved: {new Date(pages[activeTab].updated_at).toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {saved && (
                  <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
                    <CheckCircle size={16} /> Saved!
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-bold transition shadow-lg shadow-emerald-900/30"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </div>
            <div className="p-6">
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={28}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 leading-relaxed text-sm rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none font-mono"
                placeholder="Enter page content..."
              />
              <p className="text-gray-600 text-xs mt-2">
                Plain text. Line breaks are preserved on the public page.
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
