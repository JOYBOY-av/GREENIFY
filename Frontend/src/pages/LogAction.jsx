import { useState, useEffect } from 'react';
import { Sparkles, Info, AlertTriangle, Image as ImageIcon, UploadCloud, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

const LogAction = () => {
  const [actionTypes, setActionTypes] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [note, setNote] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [limits, setLimits] = useState({ noProofCount: 0, noProofLimit: 3, trustScore: 100 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [typesRes, limitsRes] = await Promise.all([
          api.get('/actions/types'),
          api.get('/actions/limits').catch(() => ({ data: { noProofCount: 0, noProofLimit: 3, trustScore: 100 } }))
        ]);
        setActionTypes(typesRes.data);
        setLimits(limitsRes.data);
      } catch (err) {
        toast.error('Failed to load action data');
      }
    };
    fetchInitialData();
  }, []);

  const handleSelectAction = (type) => {
    setSelectedAction(type);
    setVerificationResult(null);
  };

  const processFile = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error("Please upload an image or PDF");
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
      setVerificationResult(null);
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const removeFile = () => {
    setProofFile(null);
    setProofPreview(null);
  };

  const handleSubmit = async (e, withProof) => {
    e.preventDefault();

    if (!selectedAction) {
      toast.error('Please select an action type');
      return;
    }

    if (selectedAction.name === 'Other Action' && !note.trim()) {
      toast.error('Please describe your custom action');
      return;
    }

    if (withProof && !proofFile) {
      toast.error('Please upload an image to submit with proof');
      return;
    }

    setLoading(true);
    setVerificationResult(null);

    const formData = new FormData();
    formData.append('action_type_id', selectedAction.id);
    formData.append('note', note);
    formData.append('device_id', getDeviceId());
    
    if (withProof && proofFile) {
      formData.append('proof', proofFile);
    }

    try {
      const res = await api.post('/verify', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = res.data;
      setVerificationResult(data);

      if (data.status === 'verified') {
        toast.success(`+${data.points_awarded} Points Verified!`);
        if (data.new_badges && data.new_badges.length > 0) {
          data.new_badges.forEach(badge => {
            toast.success(`🏆 New Badge Unlocked: ${badge.name}`, { duration: 5000, icon: badge.icon });
          });
        }

        if (!proofFile) {
          setLimits(prev => ({ ...prev, noProofCount: prev.noProofCount + 1 }));
        }
        setTimeout(() => navigate('/dashboard'), 3000);
      } else if (data.status === 'needs_more_evidence') {
        toast.error('We need clearer evidence to verify this.');
      } else if (data.status === 'rejected') {
        toast.error('Action rejected.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.explanation) {
        toast.error(err.response.data.explanation);
        setVerificationResult({
          status: 'rejected',
          explanation: err.response.data.explanation
        });
      } else {
        toast.error('Failed to log action due to a server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Verifying...';
    return 'Submit for Verification';
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
                    ? 'border-emerald-500 bg-emerald-100/50'
                    : 'border-emerald-100 bg-emerald-50/80 hover:border-emerald-200 hover:bg-emerald-100/40'
                  }`}
              >
                <div className="text-4xl mb-2">{type.icon}</div>
                <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-1">{type.name}</h3>
                {type.name !== 'Other Action' ? (
                  <p className="text-xs text-green-600 font-medium">Up to +{type.points} pts</p>
                ) : (
                  <p className="text-xs text-green-600 font-medium">AI Evaluated</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {(selectedAction) && (
          <div className="mt-6 animate-fade-in space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedAction.name === 'Other Action' ? 'Describe your custom eco-action in detail *' : 'Add a note (Optional)'}
              </label>
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={selectedAction.name === 'Other Action' ? "e.g. Organized a community cleanup drive at the local park..." : "e.g. Rode my bike to campus instead of driving"}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Proof (Optional but recommended)
              </label>
              {!proofPreview ? (
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition cursor-pointer relative ${
                    isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload').click()}
                >
                  <div className="space-y-1 text-center">
                    <UploadCloud className={`mx-auto h-12 w-12 ${isDragging ? 'text-green-500' : 'text-gray-400'}`} />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none" onClick={(e) => e.stopPropagation()}>
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*,.pdf" onChange={handleFileChange} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, PDF up to 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative mt-2 rounded-xl overflow-hidden border border-gray-200 inline-block">
                  {proofFile?.type?.includes('pdf') ? (
                    <div className="p-8 bg-gray-50 flex flex-col items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700">{proofFile.name}</span>
                    </div>
                  ) : (
                    <img src={proofPreview} alt="Proof preview" className="max-h-64 object-contain" />
                  )}
                  <button
                    type="button"
                    onClick={removeFile}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {verificationResult && (
          <div className={`mt-6 p-6 rounded-xl border-2 shadow-sm animate-fade-in ${
            verificationResult.status === 'verified' ? 'border-green-200 bg-green-50' :
            verificationResult.status === 'needs_more_evidence' ? 'border-yellow-200 bg-yellow-50' :
            'border-red-200 bg-red-50'
          }`}>
            <h3 className={`text-xl font-bold mb-4 flex items-center ${
              verificationResult.status === 'verified' ? 'text-green-900' :
              verificationResult.status === 'needs_more_evidence' ? 'text-yellow-900' :
              'text-red-900'
            }`}>
              {verificationResult.status === 'verified' ? 'Action Verified!' :
               verificationResult.status === 'needs_more_evidence' ? 'More Evidence Needed' :
               'Action Rejected'}
              
              {verificationResult.status === 'verified' && <Sparkles className="ml-2 text-green-500 w-5 h-5" />}
              {verificationResult.status === 'needs_more_evidence' && <Info className="ml-2 text-yellow-500 w-5 h-5" />}
              {verificationResult.status === 'rejected' && <AlertTriangle className="ml-2 text-red-500 w-5 h-5" />}
            </h3>

            <p className="text-gray-700 mb-4 text-base font-medium">{verificationResult.explanation}</p>

            {verificationResult.status === 'verified' && (
              <div className="bg-emerald-100/50 p-4 rounded-lg mb-2 border border-emerald-200 flex items-center">
                <p className="text-green-800 font-bold text-lg">Points Awarded: +{verificationResult.points_awarded}</p>
              </div>
            )}
            
            <p className="text-sm text-gray-500 mt-2">
              Verification Confidence: {verificationResult.confidence_score}%
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading || !selectedAction}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Submit with Proof'}
          </button>
          
          <div className="relative group inline-block">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={loading || !selectedAction || limits.noProofCount >= limits.noProofLimit || limits.trustScore < 50}
              className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-900 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit without Proof'}
            </button>
            
            {(!loading && selectedAction && (limits.noProofCount >= limits.noProofLimit || limits.trustScore < 50)) && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1 px-2 shadow-lg z-10 text-center">
                {limits.trustScore < 50 
                  ? "Your trust score is too low to submit without proof." 
                  : `Daily limit of ${limits.noProofLimit} actions without proof reached.`}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LogAction;
