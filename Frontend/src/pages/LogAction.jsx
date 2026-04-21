import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LogAction = () => {
  const [actionTypes, setActionTypes] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/actions/types');
        setActionTypes(res.data);
      } catch (err) {
        toast.error('Failed to load action categories');
      }
    };
    fetchTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAction) {
      toast.error('Please select an action type');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/actions', {
        action_type_id: selectedAction.id,
        note
      });
      
      toast.success(`+${res.data.points_earned} Points! ${res.data.message}`);
      
      if (res.data.new_badges && res.data.new_badges.length > 0) {
        res.data.new_badges.forEach(badge => {
          toast.success(`🏆 New Badge Unlocked: ${badge.name}`, { duration: 5000, icon: badge.icon });
        });
      }
      
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to log action');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-bloom opacity-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Log a Green Action</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">What did you do today?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {actionTypes.map(type => (
              <div 
                key={type.id}
                onClick={() => setSelectedAction(type)}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition ${
                  selectedAction?.id === type.id 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
                }`}
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{type.name}</h3>
                <p className="text-xs text-green-600 font-medium">+{type.points} pts</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add a note (Optional)
          </label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Rode my bike to campus instead of driving"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading || !selectedAction}
            className="bg-green-600 text-white px-10 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging...' : 'Log Action & Earn Points'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogAction;
