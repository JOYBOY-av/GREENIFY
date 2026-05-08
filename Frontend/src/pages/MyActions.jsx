import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MyActions = () => {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const res = await api.get('/actions/my');
        setActions(res.data);
      } catch (err) {
        console.error('Failed to fetch actions', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading your actions...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-bloom opacity-0">
      <div className="mb-6 flex items-center gap-4">
        <Link to="/dashboard" className="text-gray-400 hover:text-gray-600 transition">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">My Actions</h1>
      </div>

      <div className="bg-emerald-50/80 shadow-sm border border-emerald-100 rounded-2xl overflow-hidden backdrop-blur-sm">
        {actions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {actions.map(action => (
              <li key={action.id} className="p-4 sm:px-6 hover:bg-gray-50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{action.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900">{action.name}</p>
                      <p className="text-sm text-gray-500">{new Date(action.logged_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {action.status === 'rejected' ? (
                      <div className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm inline-block">
                        Rejected
                      </div>
                    ) : action.status === 'needs_more_evidence' ? (
                      <div className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm inline-block">
                        Needs Proof
                      </div>
                    ) : action.status === 'processing' ? (
                      <div className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm inline-block">
                        Processing
                      </div>
                    ) : (
                      <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm inline-block">
                        +{action.points} pts
                      </div>
                    )}
                  </div>
                </div>
                {action.note && <p className="mt-2 text-sm text-gray-600 sm:ml-10 italic">"{action.note}"</p>}
                {(action.status === 'rejected' || action.status === 'needs_more_evidence') && action.ai_explanation && (
                  <div className="mt-2 sm:ml-10 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                    <strong>Reason:</strong> {action.ai_explanation}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No actions logged yet.</p>
            <Link to="/log-action" className="text-green-600 font-medium hover:underline mt-2 inline-block">Log an Action Now</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyActions;
