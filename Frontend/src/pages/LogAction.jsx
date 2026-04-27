import { useState, useEffect } from 'react';
import { Sparkles, Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const LogAction = () => {
  const [actionTypes, setActionTypes] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState('');

  const [customActionDescription, setCustomActionDescription] = useState('');
  const [aiResult, setAiResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

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

  const handleSelectAction = (type) => {
    setSelectedAction(type);
    setAiResult(null);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    if (!customActionDescription.trim()) {
      toast.error('Please describe your action');
      return;
    }
    setAnalyzing(true);
    try {
      const res = await api.post('/actions/analyze', { description: customActionDescription });
      setAiResult(res.data);
    } catch (err) {
      toast.error('Failed to analyze action. Try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedAction?.name === 'Other Action' && !aiResult) {
      return handleAnalyze();
    }

    if (!selectedAction) {
      toast.error('Please select an action type');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/actions', {
        action_type_id: selectedAction.id,
        note: selectedAction.name === 'Other Action' ? customActionDescription : note,
        earned_points: aiResult?.points
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

  const getButtonText = () => {
    if (loading) return 'Logging...';
    if (analyzing) return 'Analyzing...';
    if (selectedAction?.name === 'Other Action') {
      return aiResult ? 'Confirm & Log Action' : 'Analyze Action';
    }
    return 'Log Action & Earn Points';
  };

  const isSubmitDisabled = () => {
    if (loading || analyzing || !selectedAction) return true;
    if (selectedAction?.name === 'Other Action' && !aiResult && !customActionDescription.trim()) return true;
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-bloom opacity-0">
      <h1 className="text-3xl font-bold text-green-900 mb-8 text-center">Log a Green Action</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">What did you do today?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {actionTypes.map(type => (
              <div
                key={type.id}
                onClick={() => handleSelectAction(type)}
                className={`cursor-pointer p-4 rounded-xl border-2 text-center transition ${selectedAction?.id === type.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
                  }`}
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{type.name}</h3>
                {type.name !== 'Other Action' ? (
                  <p className="text-xs text-green-600 font-medium">+{type.points} pts</p>
                ) : (
                  <p className="text-xs text-green-600 font-medium">AI Evaluated</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedAction?.name === 'Other Action' ? (
          <div className="mt-6 animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your custom eco-action in detail
            </label>
            <textarea
              rows="4"
              value={customActionDescription}
              onChange={(e) => setCustomActionDescription(e.target.value)}
              placeholder="e.g. Organized a community cleanup drive at the local park and collected 5 bags of trash."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
              disabled={analyzing || !!aiResult}
            />
          </div>
        ) : (
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
        )}

        {aiResult && (
          <div className="mt-6 p-6 rounded-xl border-2 bg-white animate-fade-in shadow-sm border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
              AI Analysis Result
              {aiResult.category === 'eco_friendly' && <Sparkles className="ml-2 text-green-500 w-5 h-5" />}
              {aiResult.category === 'neutral' && <Info className="ml-2 text-yellow-500 w-5 h-5" />}
              {aiResult.category === 'harmful' && <AlertTriangle className="ml-2 text-red-500 w-5 h-5" />}
            </h3>

            <p className="text-gray-700 mb-4 text-base font-medium">{aiResult.description || aiResult.message}</p>

            {aiResult.category === 'eco_friendly' && (
              <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100 flex items-center">
                <p className="text-green-800 font-bold text-lg">Points Awarded: +{aiResult.points}</p>
              </div>
            )}

            {aiResult.suggestion && (
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-orange-800 font-medium flex items-start">
                  <Lightbulb size={18} className="mr-2 shrink-0 mt-0.5" />
                  <span>{aiResult.suggestion}</span>
                </p>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setAiResult(null)}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Edit Description
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitDisabled()}
            className="bg-green-600 text-white px-10 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LogAction;
