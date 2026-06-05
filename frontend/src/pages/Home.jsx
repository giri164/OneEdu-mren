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
      {/* Hero Section */}
      <div className="relative bg-primary text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-br from-primary via-secondary to-accent opacity-90"></div>
        </div>
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&h=600&fit=crop"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-t from-transparent via-transparent to-white/10"></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-secondary/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-accent/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-orange-400/25 rounded-lg rotate-45 blur-lg"></div>

        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 depth-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-3d transform-style-preserve-3d">
            Map Your Future with
            <span className="block bg-gradient-to-r from-accent via-secondary to-primary bg-clip-text text-transparent animate-pulse-slow">
              OneEdu
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-orange-50 drop-shadow-lg transform translate-z-10">
            A comprehensive career guidance platform for Intermediate and B.Tech students to explore domains, learn skills, and track job opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="bg-cream text-primary px-10 py-5 rounded-2xl font-bold text-lg btn-3d glow-3d shadow-3d-lg hover-lift-3d transform-style-preserve-3d group"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              to="/login"
              className="border-2 border-white/80 text-white px-10 py-5 rounded-2xl font-bold text-lg btn-3d glass-3d hover-lift-3d transform-style-preserve-3d backdrop-blur-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section with Advanced 3D Cards */}
      <div className="py-20 px-4 max-w-7xl mx-auto perspective-1000">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-slate-100 text-3d">Why Choose OneEdu?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 - Flip Card Effect */}
          <div className="flip-card hover-lift-3d transform-style-preserve-3d">
            <div className="flip-card-inner">
              <div className="flip-card-front group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 card-3d glow-3d shadow-3d">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 to-amber-100">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f70504c11?w=400&h=300&fit=crop"
                    alt="Stream Mapping"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm rounded-full p-2">
                    <GraduationCap className="text-white" size={20} />
                  </div>
                </div>
                <div className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100">Stream Mapping</h3>
                  <p className="text-gray-600 dark:text-slate-300">Explore career paths tailored to your educational background</p>
                  <div className="mt-4 text-sm text-primary font-semibold">Hover to learn more →</div>
                </div>
              </div>
              <div className="flip-card-back bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8 text-center card-3d shadow-3d-lg">
                <GraduationCap className="text-white mx-auto mb-4" size={48} />
                <h3 className="text-2xl font-bold mb-4">Advanced Mapping</h3>
                <p className="text-white/90 leading-relaxed">
                  From Computer Science to Mechanical Engineering, get personalized career roadmaps based on your stream and interests.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold">10+</div>
                    <div className="text-white/70">Streams</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="font-bold">50+</div>
                    <div className="text-white/70">Domains</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2 - Glass Morphism Card */}
          <div className="group relative rounded-2xl overflow-hidden glass-3d card-3d glow-3d hover-lift-3d transform-style-preserve-3d">
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop"
                alt="Skill Paths"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Search className="text-white" size={20} />
              </div>
            </div>
            <div className="p-8 text-center relative z-10">
              <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Search className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Skill Paths</h3>
              <p className="text-white/90 leading-relaxed">Get curated list of skills and learning resources (free & paid) for every specific role.</p>
              <div className="mt-6 flex justify-center space-x-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">Free Resources</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs text-white backdrop-blur-sm">Paid Courses</span>
              </div>
            </div>
          </div>

          {/* Feature 3 - Interactive 3D Card */}
          <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 card-3d glow-3d hover-lift-3d transform-style-preserve-3d">
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
                alt="Job Tracking"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm rounded-full p-2">
                <Briefcase className="text-white" size={20} />
              </div>
            </div>
            <div className="p-8 text-center">
              <div className="bg-gradient-to-br from-accent to-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Briefcase className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100">Job Tracking</h3>
              <p className="text-gray-600 dark:text-slate-300 leading-relaxed">Monitor salaries, top companies, and job trends across various industries in real-time.</p>
              <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
                <div className="bg-primary/10 rounded-lg p-2">
                  <div className="font-bold text-primary">500+</div>
                  <div className="text-gray-500">Companies</div>
                </div>
                <div className="bg-secondary/10 rounded-lg p-2">
                  <div className="font-bold text-secondary">Real-time</div>
                  <div className="text-gray-500">Updates</div>
                </div>
                <div className="bg-accent/10 rounded-lg p-2">
                  <div className="font-bold text-accent">24/7</div>
                  <div className="text-gray-500">Tracking</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Proof Section with 3D Effects */}
      <div className="relative bg-gradient-to-r from-primary via-secondary to-accent py-20 text-white overflow-hidden parallax-3d transform-style-preserve-3d">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 parallax-layer parallax-layer-1 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1400&h=400&fit=crop"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl float-3d depth-2"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-accent/20 rounded-full blur-2xl float-3d depth-3" style={{ animationDelay: '3s' }}></div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full animate-pulse-slow" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center relative z-10">
          <div className="p-8 rounded-2xl glass-3d card-3d glow-3d hover-lift-3d transform-style-preserve-3d group cursor-pointer">
            <div className="text-5xl font-black text-3d mb-2 group-hover:scale-110 transition-transform duration-300">10+</div>
            <div className="text-white/90 font-medium text-lg">Streams</div>
            <div className="mt-4 w-12 h-1 bg-accent rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
          </div>
          <div className="p-8 rounded-2xl glass-3d card-3d glow-3d hover-lift-3d transform-style-preserve-3d group cursor-pointer">
            <div className="text-5xl font-black text-3d mb-2 group-hover:scale-110 transition-transform duration-300">50+</div>
            <div className="text-white/90 font-medium text-lg">Domains</div>
            <div className="mt-4 w-12 h-1 bg-secondary rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
          </div>
          <div className="p-8 rounded-2xl glass-3d card-3d glow-3d hover-lift-3d transform-style-preserve-3d group cursor-pointer">
            <div className="text-5xl font-black text-3d mb-2 group-hover:scale-110 transition-transform duration-300">200+</div>
            <div className="text-white/90 font-medium text-lg">Skills</div>
            <div className="mt-4 w-12 h-1 bg-primary rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
          </div>
          <div className="p-8 rounded-2xl glass-3d card-3d glow-3d hover-lift-3d transform-style-preserve-3d group cursor-pointer">
            <div className="text-5xl font-black text-3d mb-2 group-hover:scale-110 transition-transform duration-300">500+</div>
            <div className="text-white/90 font-medium text-lg">Resources</div>
            <div className="mt-4 w-12 h-1 bg-accent rounded-full mx-auto group-hover:w-20 transition-all duration-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
