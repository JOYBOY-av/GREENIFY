import { useEffect, useState } from 'react';
import adminApi from '../api/admin';

const Privacy = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('Privacy Policy');
  const [updatedAt, setUpdatedAt] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/legal/privacy').then(r => {
      setContent(r.data.content);
      setTitle(r.data.title);
      setUpdatedAt(r.data.updated_at);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-extrabold text-gray-900">{title}</h1>
        </div>
        <p className="text-sm text-gray-400 mb-8 border-b border-gray-100 pb-6">
          {updatedAt ? `Last Updated: ${new Date(updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : 'Last Updated: April 20, 2025'}
        </p>
        {loading ? (
          <div className="text-gray-400 text-sm">Loading...</div>
        ) : (
          <div className="space-y-4 text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default Privacy;
