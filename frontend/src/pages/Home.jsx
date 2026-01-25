import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Briefcase, GraduationCap, MapPin, Search } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <div className="relative bg-primary text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Map Your Future with OneEdu
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-orange-50">
            A comprehensive career guidance platform for Intermediate and B.Tech students to explore domains, learn skills, and track job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-cream text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-cream hover:text-primary transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Why Choose OneEdu?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-md transition">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="text-secondary" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Stream Mapping</h3>
            <p className="text-gray-600">Explore career paths tailored to your educational background, from CSE to Mechanical Engineering.</p>
          </div>
          <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-md transition">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="text-accent" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Skill Paths</h3>
            <p className="text-gray-600">Get curated list of skills and learning resources (free & paid) for every specific role.</p>
          </div>
          <div className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-md transition">
            <div className="bg-amber-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-primary" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Job Tracking</h3>
            <p className="text-gray-600">Monitor salaries, top companies, and job trends across various industries in real-time.</p>
          </div>
        </div>
      </div>

      {/* Stats / Proof Section */}
      <div className="bg-cream/50 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-secondary font-bold">
          <div>
            <div className="text-4xl">10+</div>
            <div className="text-gray-500 font-normal">Streams</div>
          </div>
          <div>
            <div className="text-4xl">50+</div>
            <div className="text-gray-500 font-normal">Domains</div>
          </div>
          <div>
            <div className="text-4xl">200+</div>
            <div className="text-gray-500 font-normal">Skills</div>
          </div>
          <div>
            <div className="text-4xl">500+</div>
            <div className="text-gray-500 font-normal">Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
