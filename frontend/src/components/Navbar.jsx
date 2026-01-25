import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-cream shadow-sm border-b border-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">
              OneEdu
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
            ) : (user && user._id) ? (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin" className="text-gray-700 hover:text-primary flex items-center gap-1 font-bold">
                    <Settings size={18} />
                    Admin Panel
                  </Link>
                ) : (
                  <Link to="/dashboard" className="text-gray-700 hover:text-primary flex items-center gap-1">
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-2 border-l pl-4 hover:opacity-80 transition">
                  <img 
                    src={user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} 
                    alt="Avatar" 
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <span className="text-sm font-bold text-gray-700">{user.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary">Login</Link>
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
