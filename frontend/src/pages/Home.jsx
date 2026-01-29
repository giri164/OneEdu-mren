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
    <div className="bg-cream dark:bg-slate-950 dark:text-slate-100 transition-colors pt-16">
      {/* Hero Section with Background Image */}
      <div className="relative bg-primary text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1553531088-fde7e220b50b?w=1400&h=600&fit=crop&q=80"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Animated Gradient Overlays */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg">
            Map Your Future with OneEdu
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-orange-50 drop-shadow">
            A comprehensive career guidance platform for Intermediate and B.Tech students to explore domains, learn skills, and track job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-cream text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-white transition shadow-lg transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-cream hover:text-primary transition transform hover:scale-105"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-slate-100">Why Choose OneEdu?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
              <img 
                src="https://images.unsplash.com/photo-1516534775068-bb4d414b6f40?w=400&h=300&fit=crop&q=80"
                alt="Stream Mapping"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="p-8 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Stream Mapping</h3>
              <p className="text-gray-600 dark:text-slate-300">Explore career paths tailored to your educational background, from CSE to Mechanical Engineering.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&q=80"
                alt="Skill Paths"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="p-8 text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Skill Paths</h3>
              <p className="text-gray-600 dark:text-slate-300">Get curated list of skills and learning resources (free & paid) for every specific role.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-xl transition transform hover:-translate-y-2">
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-696ce0213d3a?w=400&h=300&fit=crop&q=80"
                alt="Job Tracking"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            <div className="p-8 text-center">
              <div className="bg-amber-200 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-slate-100">Job Tracking</h3>
              <p className="text-gray-600 dark:text-slate-300">Monitor salaries, top companies, and job trends across various industries in real-time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Proof Section */}
      <div className="relative bg-gradient-to-r from-primary to-secondary py-20 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1400&h=400&fit=crop&q=80"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <div className="text-4xl font-bold drop-shadow-lg">10+</div>
            <div className="text-white/80 font-normal mt-2">Streams</div>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <div className="text-4xl font-bold drop-shadow-lg">50+</div>
            <div className="text-white/80 font-normal mt-2">Domains</div>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <div className="text-4xl font-bold drop-shadow-lg">200+</div>
            <div className="text-white/80 font-normal mt-2">Skills</div>
          </div>
          <div className="p-6 rounded-xl bg-white/10 backdrop-blur border border-white/20">
            <div className="text-4xl font-bold drop-shadow-lg">500+</div>
            <div className="text-white/80 font-normal mt-2">Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
