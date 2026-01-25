import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { 
  User as UserIcon, Mail, Lock, Camera, 
  Save, Loader2, CheckCircle2, BookOpen, 
  TrendingUp, Settings, LogOut 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'courses', 'security'

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const { data } = await API.get('/auth/me');
        updateUser(data.data);
      } catch (err) {
        console.error('Failed to fetch user details:', err);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        avatar: user.avatar || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await API.put('/auth/updatedetails', profileData);
      updateUser({ ...user, ...data.data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    setIsUpdatingPassword(true);
    setMessage({ type: '', text: '' });
    try {
      await API.put('/auth/updatepassword', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password update failed' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const avatarOptions = [
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Felix`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Max`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Harley`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=Buster`,
  ];

  if (!user) return <div className="p-10 text-center">Loading profile...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row min-h-[600px]">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 bg-gray-50/50 border-r border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="relative inline-block group">
              <img 
                src={user.avatar || avatarOptions[0]} 
                alt="Avatar" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg mx-auto object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="bg-black/50 rounded-full p-2 text-white">
                  <Camera size={20} />
                </div>
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
              {user.role}
            </span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <UserIcon size={20} /> Edit Profile
            </button>
            {user.role !== 'admin' && (
              <button 
                onClick={() => setActiveTab('courses')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'courses' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BookOpen size={20} /> My Progress
              </button>
            )}
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'security' ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <Settings size={20} /> Security
            </button>
            <div className="pt-4 border-t border-gray-200 mt-4">
              <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} /> Log Out
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12">
          {message.text && (
            <div className={`mb-8 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} /> : <TrendingUp size={20} className="rotate-45" />}
              <p className="text-sm font-bold">{message.text}</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-6">Profile Settings</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address (Read-only)</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 outline-none cursor-not-allowed"
                      value={user.email}
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Choose Avatar</label>
                  <div className="flex flex-wrap gap-4">
                    {avatarOptions.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProfileData({...profileData, avatar: url})}
                        className={`p-1 rounded-full border-2 transition ${profileData.avatar === url ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300'}`}
                      >
                        <img src={url} alt={`Avatar option ${idx}`} className="w-14 h-14 rounded-full" />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-primary hover:bg-secondary text-white font-bold px-8 py-3 rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Profile</>}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'courses' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">Learning Journey</h3>
              <div className="grid grid-cols-1 gap-6">
                {user.courseProgress && user.courseProgress.length > 0 ? (
                  user.courseProgress.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition">
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-gray-900 mb-1">{item.course?.title || 'Unknown Course'}</h4>
                        <p className="text-sm text-gray-500 mb-4">{item.course?.provider || 'External'}</p>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex-1 bg-white rounded-full h-3 border border-gray-200 overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${item.isCompleted ? 'bg-green-500' : 'bg-primary'}`}
                              style={{ width: `${item.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className={`text-sm font-bold ${item.isCompleted ? 'text-green-600' : 'text-primary'}`}>
                            {item.completionPercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {item.isCompleted ? (
                           <span className="px-4 py-2 bg-green-100 text-green-700 text-sm font-bold rounded-lg flex items-center gap-2">
                             <CheckCircle2 size={16} /> Completed
                           </span>
                        ) : (
                          <button 
                            onClick={() => {
                              const targetId = item.course?.role || item.course?._id;
                              navigate(`/role/${targetId}`);
                            }} 
                            className="px-4 py-2 border border-primary text-primary text-sm font-bold rounded-lg hover:bg-primary hover:text-white transition"
                          >
                            Continue Learning
                          </button>
                        )}
                        <a 
                          href={item.course?.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-white text-gray-400 hover:text-primary rounded-lg border border-gray-200 transition"
                        >
                          <TrendingUp size={20} />
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                     <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
                     <p className="text-gray-500 font-bold">You haven't started any courses yet.</p>
                     <button 
                       onClick={() => navigate('/dashboard')}
                       className="mt-4 text-primary font-bold hover:underline"
                     >
                       Explore Career Paths
                     </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <h3 className="text-2xl font-bold mb-6">Security Settings</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
                        placeholder="••••••••"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                        required
                        minLength={5}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
                        placeholder="••••••••"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        required
                        minLength={5}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3 rounded-xl transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isUpdatingPassword ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={20} /> Update Password</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
