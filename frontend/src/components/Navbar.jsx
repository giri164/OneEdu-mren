import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Sun,
  Moon,
  MessageSquare,
  Search,
  Briefcase,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';
import logo from '../assets/logo.svg';

const Navbar = () => {
  const [showMore, setShowMore] = useState(false);
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cream dark:bg-slate-900 shadow-sm border-b border-secondary/10 dark:border-slate-800 transition-colors">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Fun Bird Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition group">
              <img src={logo} alt="OneEdu logo" className="w-10 h-10 drop-shadow-md" />
              <span className="text-2xl font-bold text-primary dark:text-amber-200">
                OneEdu
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-slate-700 bg-white/70 dark:bg-slate-800 text-gray-700 dark:text-amber-100 transition"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
            ) : user && user._id ? (
              <>
                <NotificationCenter />
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 flex items-center gap-1 font-bold">
                    <Settings size={18} />
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/dashboard"
                      className="text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 flex items-center gap-1"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      to="/feedback"
                      className="p-2 rounded-full border border-transparent hover:border-orange-400 dark:hover:border-orange-400 bg-gradient-to-br from-orange-400 to-red-500 text-white transition hover:shadow-lg shadow-md transform hover:scale-110 hover:from-orange-500 hover:to-red-600"
                      title="Send Feedback"
                    >
                      <MessageSquare size={18} />
                    </Link>

                    <div className="relative">
                      <button
                        onClick={() => setShowMore(prev => !prev)}
                        className="flex items-center gap-1 text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 px-3 py-2 rounded-md border border-transparent hover:border-gray-200 dark:hover:border-slate-700 transition"
                      >
                        More
                        {showMore ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>

                      {showMore && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg z-50">
                          <Link
                            to="/search"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-amber-100 hover:bg-gray-50 dark:hover:bg-slate-800"
                            onClick={() => setShowMore(false)}
                          >
                            <Search size={16} />
                            Search
                          </Link>
                          <Link
                            to="/applications"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-amber-100 hover:bg-gray-50 dark:hover:bg-slate-800"
                            onClick={() => setShowMore(false)}
                          >
                            <Briefcase size={16} />
                            Applications
                          </Link>
                          <Link
                            to="/resume"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-amber-100 hover:bg-gray-50 dark:hover:bg-slate-800"
                            onClick={() => setShowMore(false)}
                          >
                            <FileText size={16} />
                            Resume
                          </Link>
                        </div>
                      )}
                    </div>
                  </>
                )}
                <Link to="/profile" className="flex items-center gap-2 border-l pl-4 border-gray-200 dark:border-slate-800 hover:opacity-80 transition">
                  <img
                    src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full border border-gray-200 dark:border-slate-800"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-amber-100">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-slate-800"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200">Login</Link>
                <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-secondary transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
