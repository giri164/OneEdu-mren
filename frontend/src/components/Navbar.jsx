import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Settings, Sun, Moon, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
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
            {/* Eagle Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition group">
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">🦅</span>
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
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 flex items-center gap-1 font-bold">
                    <Settings size={18} />
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-gray-700 dark:text-amber-100 hover:text-primary dark:hover:text-amber-200 flex items-center gap-1">
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
