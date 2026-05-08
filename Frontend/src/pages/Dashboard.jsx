import { useState, useEffect, useContext, useRef } from 'react';
import { User, Lock, Key, Mail, Camera, CheckCircle, Star, Flame, Medal } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};
const strengthLabel = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-600'];

const ProfilePanel = ({ onClose }) => {
  const fileRef = useRef();
  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', college: '' });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const { logout } = useContext(AuthContext);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pwMethod, setPwMethod] = useState('current');

  const [cpForm, setCpForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [cpLoading, setCpLoading] = useState(false);

  const [otpStep, setOtpStep] = useState(1);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpForm, setOtpForm] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);

  useEffect(() => {
    api.get('/profile').then(r => {
      setProfile(r.data);
      setEditForm({ name: r.data.name, college: r.data.college || '' });
      setPhotoPreview(r.data.profile_photo || null);
    }).catch(() => toast.error('Failed to load profile'));
  }, []);

  useEffect(() => {
    if (otpCooldown <= 0) return;
    const t = setTimeout(() => setOtpCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [otpCooldown]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) { toast.error('Image must be under 1MB'); return; }
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handlePhotoSave = async () => {
    if (!photoPreview || photoPreview === profile?.profile_photo) { toast('No new photo selected'); return; }
    try {
      await api.post('/profile/photo', { photo: photoPreview });
      toast.success('Profile photo updated!');
      setProfile(p => ({ ...p, profile_photo: photoPreview }));
    } catch { toast.error('Failed to upload photo'); }
  };

  const handleProfileSave = async () => {
    try {
      const r = await api.put('/profile', editForm);
      setProfile(r.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile'); }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await api.delete('/profile');
      toast.success('Account deleted successfully.');
      onClose();
      logout();
    } catch (err) {
      toast.error('Failed to delete account');
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (cpForm.newPassword !== cpForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (cpForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setCpLoading(true);
    try {
      await api.post('/auth/change-password', { currentPassword: cpForm.currentPassword, newPassword: cpForm.newPassword });
      toast.success('Password changed! Please log in again.');
      setCpForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to change password');
    } finally { setCpLoading(false); }
  };

  const handleSendOtp = async () => {
    if (otpCooldown > 0) return;
    setOtpLoading(true);
    try {
      const r = await api.post('/auth/send-change-otp');
      setMaskedEmail(r.data.maskedEmail);
      setOtpStep(2);
      setOtpCooldown(60);
      toast.success('OTP sent to your email!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Failed to send OTP');
    } finally { setOtpLoading(false); }
  };

  const handleOtpReset = async (e) => {
    e.preventDefault();
    if (otpForm.newPassword !== otpForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (otpForm.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setOtpLoading(true);
    try {
      await api.post('/auth/verify-otp-reset', { otp: otpForm.otp, newPassword: otpForm.newPassword });
      toast.success('Password changed successfully!');
      setOtpStep(1);
      setOtpForm({ otp: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Invalid or expired OTP');
    } finally { setOtpLoading(false); }
  };

  const pwStrength = getStrength(pwMethod === 'current' ? cpForm.newPassword : otpForm.newPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">My Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <div className="flex border-b border-gray-100">
          {[['profile', <User size={16} className="inline mr-1" />, 'Profile'], ['password', <Lock size={16} className="inline mr-1" />, 'Change Password']].map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={'flex-1 py-3 text-sm font-medium transition flex items-center justify-center ' + (activeTab === key ? 'text-green-700 border-b-2 border-green-600 bg-green-50/50' : 'text-gray-500 hover:text-gray-700')}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">

          {activeTab === 'profile' && (
            <div className="space-y-6">

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 rounded-full border-4 border-green-100 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {photoPreview
                      ? <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                      : <User className="text-gray-300 w-12 h-12" />
                    }
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center shadow hover:bg-green-700 transition text-lg"
                    title="Change photo"
                  >
                    <Camera size={20} />
                  </button>
                  <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handlePhotoChange} />
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <p className="font-semibold text-gray-900 text-lg">{profile?.name || '...'}</p>
                  <p className="text-gray-500 text-sm">{profile?.email}</p>
                  <p className="text-gray-400 text-xs mt-1">{profile?.college}</p>
                  {photoPreview !== profile?.profile_photo && (
                    <button onClick={handlePhotoSave} className="mt-3 bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                      Save Photo
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text" value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <input
                    type="text" value={editForm.college}
                    onChange={e => setEditForm(f => ({ ...f, college: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <button onClick={handleProfileSave} className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm">
                  Save Changes
                </button>
              </div>
              

              <div className="border-t border-gray-100 pt-5 mt-5">
                {!showDeleteConfirm ? (
                  <button 
                    onClick={() => setShowDeleteConfirm(true)} 
                    className="w-full bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-xl font-semibold hover:bg-red-100 transition text-sm"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <p className="text-sm text-red-800 mb-3 font-medium">Are you sure? This action cannot be undone and will delete all your actions and badges.</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowDeleteConfirm(false)} 
                        disabled={deleteLoading}
                        className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleDeleteAccount} 
                        disabled={deleteLoading}
                        className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                      >
                        {deleteLoading ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-5">

              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                {[['current', <Key size={14} className="inline mr-1" />, 'Current Password'], ['otp', <Mail size={14} className="inline mr-1" />, 'Email OTP']].map(([m, icon, label]) => (
                  <button
                    key={m}
                    onClick={() => { setPwMethod(m); setOtpStep(1); }}
                    className={'flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center ' + (pwMethod === m ? 'bg-white shadow text-green-700' : 'text-gray-500 hover:text-gray-700')}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>

              {pwMethod === 'current' && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    ['currentPassword', 'Current Password', 'Your existing password'],
                    ['newPassword', 'New Password', 'At least 6 characters'],
                    ['confirmPassword', 'Confirm New Password', 'Repeat new password'],
                  ].map(([field, label, placeholder]) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type="password" placeholder={placeholder} value={cpForm[field]}
                        onChange={e => setCpForm(f => ({ ...f, [field]: e.target.value }))}
                        required
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      {field === 'newPassword' && cpForm.newPassword && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className={'h-full rounded-full transition-all ' + strengthColor[pwStrength]} style={{ width: (pwStrength / 5 * 100) + '%' }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{strengthLabel[pwStrength]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    type="submit" disabled={cpLoading}
                    className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-60"
                  >
                    {cpLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}

              {pwMethod === 'otp' && (
                <div className="space-y-4">
                  {otpStep === 1 && (
                    <div className="text-center py-4">
                    <div className="text-green-600 mb-4 flex justify-center">
                      <Mail size={48} />
                    </div>
                      <p className="text-gray-600 text-sm mb-6">We'll send a 6-digit OTP to your registered email address.</p>
                      <button
                        onClick={handleSendOtp}
                        disabled={otpLoading || otpCooldown > 0}
                        className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-60"
                      >
                        {otpLoading ? 'Sending...' : otpCooldown > 0 ? 'Resend in ' + otpCooldown + 's' : 'Send OTP to Email'}
                      </button>
                    </div>
                  )}

                  {otpStep === 2 && (
                    <form onSubmit={handleOtpReset} className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 flex items-center gap-2">
                        <CheckCircle size={18} className="shrink-0" />
                        <span>OTP sent to <strong>{maskedEmail}</strong></span>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                        <input
                          type="text" placeholder="6-digit OTP" maxLength={6}
                          value={otpForm.otp}
                          onChange={e => setOtpForm(f => ({ ...f, otp: e.target.value }))}
                          required
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-green-400 text-center text-lg font-bold"
                        />
                      </div>
                      {[['newPassword', 'New Password'], ['confirmPassword', 'Confirm Password']].map(([field, label]) => (
                        <div key={field}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                          <input
                            type="password" placeholder="At least 6 characters"
                            value={otpForm[field]}
                            onChange={e => setOtpForm(f => ({ ...f, [field]: e.target.value }))}
                            required
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                          {field === 'newPassword' && otpForm.newPassword && (
                            <div className="mt-2">
                              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div className={'h-full rounded-full transition-all ' + strengthColor[pwStrength]} style={{ width: (pwStrength / 5 * 100) + '%' }} />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{strengthLabel[pwStrength]}</p>
                            </div>
                          )}
                        </div>
                      ))}
                      <button
                        type="submit" disabled={otpLoading}
                        className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition text-sm disabled:opacity-60"
                      >
                        {otpLoading ? 'Verifying...' : 'Verify OTP & Update Password'}
                      </button>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpCooldown > 0}
                        className="w-full text-sm text-gray-500 hover:text-green-600 disabled:opacity-40"
                      >
                        {otpCooldown > 0 ? 'Resend OTP in ' + otpCooldown + 's' : 'Resend OTP'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();

    api.get('/profile').then(r => setProfilePhoto(r.data.profile_photo || null)).catch(() => {});
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  if (!data) return <div className="p-8 text-center text-red-500">Failed to load data.</div>;

  return (
    <>
      {showProfile && <ProfilePanel onClose={() => setShowProfile(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-bloom opacity-0">
        
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {data.user.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">{data.user.college}</p>
          </div>

        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center text-green-600">
              <Star size={32} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Total Points</p>
              <p className="text-3xl font-bold text-gray-900">{data.total_points}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center text-orange-500">
              <Flame size={32} fill="currentColor" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Active Days</p>
              <p className="text-3xl font-bold text-gray-900">{data.streak}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center text-blue-600">
              <Medal size={32} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Badges Earned</p>
              <p className="text-3xl font-bold text-gray-900">{data.badges.length}</p>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Actions</h2>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
              {data.recent_actions.length > 0 ? (
                <div>
                  <ul className="divide-y divide-gray-100">
                    {data.recent_actions.map(action => (
                      <li key={action.id} className="p-4 sm:px-6 hover:bg-gray-50 transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{action.icon}</span>
                            <div>
                              <p className="font-medium text-gray-900">{action.name}</p>
                              <p className="text-sm text-gray-500">{new Date(action.logged_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div>
                            {action.status === 'rejected' ? (
                              <div className="font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm">
                                Rejected
                              </div>
                            ) : action.status === 'needs_more_evidence' ? (
                              <div className="font-bold text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm">
                                Needs Proof
                              </div>
                            ) : action.status === 'processing' ? (
                              <div className="font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
                                Processing
                              </div>
                            ) : (
                              <div className="font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                                +{action.points} pts
                              </div>
                            )}
                          </div>
                        </div>
                        {action.note && <p className="mt-2 text-sm text-gray-600 ml-10 italic">"{action.note}"</p>}
                        {(action.status === 'rejected' || action.status === 'needs_more_evidence') && action.ai_explanation && (
                          <div className="mt-2 ml-10 text-xs text-red-500 bg-red-50 p-2 rounded border border-red-100">
                            <strong>Reason:</strong> {action.ai_explanation}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 transition">
                    <Link to="/my-actions" className="text-sm font-bold text-green-600 hover:text-green-700">
                      View All My Actions &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No actions logged yet.</p>
                </div>
              )}
            </div>
          </div>

          <div>
            
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
              <button
                onClick={() => setShowProfile(true)}
                className="w-full bg-white border border-gray-100 shadow-sm rounded-2xl p-4 flex items-center gap-4 hover:border-green-200 hover:shadow-md transition text-left"
              >
                <div className="w-14 h-14 rounded-full border-2 border-green-100 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                  {profilePhoto
                    ? <img src={profilePhoto} alt="Me" className="w-full h-full object-cover" />
                    : <User className="text-gray-300 w-8 h-8" />
                  }
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{data.user.name}</p>
                  <p className="text-sm text-gray-500">{data.user.college}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">Edit Profile & Password &rarr;</p>
                </div>
              </button>
            </div>

            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Badges</h2>
              <Link to="/badges" className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline">View All &rarr;</Link>
            </div>
            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6">
              {data.badges.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {data.badges.map(badge => (
                    <div key={badge.id} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <p className="font-semibold text-sm text-gray-900">{badge.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">Log actions to earn badges!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
