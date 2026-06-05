import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Target, Award, ArrowRight, Loader2, Sparkles, Compass } from 'lucide-react';
import AnimatedCard from '../components/AnimatedCard';
import PageTransition from '../components/PageTransition';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [userStream, setUserStream] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const { data: streamsData } = await API.get('/user/streams');
        setStreams(streamsData.data);

        // If user has a stream, fetch its sub-domains and details
        if (user.stream) {
          const { data: streamDetails } = await API.get(`/user/career-path/${user.stream}`);
          setUserStream(streamDetails.data);
        } else {
          setUserStream(null);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.stream, user?._id]);

  const handleStreamSelect = async (streamId) => {
    setLoading(true);
    try {
      const { data } = await API.put('/user/profile', { stream: streamId });
      // Update global context state - ensure we pass a new object reference
      updateUser({ ...data.data });
    } catch (error) {
      console.error('Stream selection error:', error);
      alert('Failed to update your stream. Please try again.');
    } finally {
      // We don't set loading to false here; the useEffect triggered by user.stream will handle it
    }
  };

  if (loading && streams.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-600 font-medium animate-pulse">Initializing your personalized dashboard...</p>
      </div>
    );
  }

  // Determine if user has selected a stream and pull its slug
  const hasStream = user?.stream && typeof user.stream === 'string' && user.stream.length > 5;
  const activeStream = hasStream ? streams.find((s) => s._id === user.stream) : null;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-12 pt-24 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-slate-100 flex items-center gap-3">
            Welcome back, {user?.name}! <Sparkles className="text-yellow-400" />
          </h1>
          <p className="text-lg text-gray-600 dark:text-slate-300 mt-2">Ready to master new skills today?</p>
        </div>
        {hasStream && (
          <button 
            onClick={() => handleStreamSelect(null)}
            className="text-sm font-bold text-gray-500 dark:text-slate-300 hover:text-red-500 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-xl transition hover:border-red-200 dark:hover:border-red-500"
          >
            Change Stream
          </button>
        )}
      </div>

      {!hasStream ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-4">Choose Your Career Foundation</h2>
            <p className="text-gray-600 dark:text-slate-300 text-lg">Select a stream to unlock specialized roadmaps, expert-curated courses, and real-time progress tracking.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
            {streams.map((s, index) => {
              // Map stream names to specific background images
              const getStreamImage = (streamName) => {
                const name = streamName.toLowerCase();

                if (name.includes('computer science')) {
                  return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=450&fit=crop';
                } else if (name.includes('mechanical')) {
                  return 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=450&fit=crop';
                } else if (name.includes('civil')) {
                  return 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=600&h=450&fit=crop';
                } else if (name.includes('electronics') && name.includes('communication')) {
                  return 'https://images.unsplash.com/photo-1606933248051-5ce98bebdc0e?w=600&h=450&fit=crop';
                } else if (name.includes('electrical') && name.includes('electronics')) {
                  return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop';
                }
                return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=450&fit=crop';
              };

              const streamImage = getStreamImage(s.name);

              return (
              <AnimatedCard
                key={s._id}
                delay={index * 0.1}
                className="h-full cursor-pointer overflow-hidden"
                onClick={() => handleStreamSelect(s._id)}
              >
                {/* Background Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img
                    src={streamImage}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                    <Compass size={20} className="text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 h-full flex flex-col">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-primary/30">
                    <Compass size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-slate-100 group-hover:text-primary transition-all duration-300">{s.name}</h3>
                  <p className="text-gray-500 dark:text-slate-300 text-sm mb-6 leading-relaxed flex-grow">{s.description}</p>
                  <div className="flex items-center gap-2 text-primary font-bold group-hover:text-secondary transition-colors">
                    Start Learning <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </AnimatedCard>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Quick Stats Grid with 3D Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
            <AnimatedCard
              className="bg-gradient-to-br from-secondary to-primary text-white relative overflow-hidden"
              glassmorphism={false}
            >
              <BookOpen className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" size={120} />
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
                  <BookOpen size={24} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs opacity-90">Current Track</span>
              </div>
              <div className="text-4xl font-black mb-2 relative z-10">{userStream?.name}</div>
              <div className="w-16 h-1 bg-white/30 rounded-full relative z-10"></div>
            </AnimatedCard>

            <AnimatedCard className="p-8 border-2 border-orange-50 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-orange-100 to-secondary/20 p-3 rounded-2xl text-secondary shadow-lg">
                  <Target size={24} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs text-gray-500">Sub-Domains Available</span>
              </div>
              <div className="text-5xl font-black text-gray-900 dark:text-white mb-4">{userStream?.subDomains?.length || 0}</div>
              <div className="grid grid-cols-3 gap-2">
                {userStream?.subDomains?.slice(0, 3).map((_, i) => (
                  <div key={i} className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60"></div>
                ))}
              </div>
            </AnimatedCard>

            <AnimatedCard className="p-8 border-2 border-orange-50 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-amber-100 to-accent/20 p-3 rounded-2xl text-accent shadow-lg">
                  <Award size={24} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs text-gray-500">Overall Progress</span>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <div className="text-5xl font-black text-gray-900 dark:text-white">
                  {Math.round(
                    (user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) /
                    Math.max(user?.courseProgress?.length || 1, 1)
                  )}%
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-slate-700 rounded-full h-4 mb-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-1000 shadow-sm relative"
                    style={{ width: `${Math.round((user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) / Math.max(user?.courseProgress?.length || 1, 1))}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-slate-400">
                {user?.courseProgress?.length || 0} courses in progress
              </div>
            </AnimatedCard>
          </div>

          {/* Sub-Domains Collection */}
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Recommended Pathways</h2>
                <p className="text-gray-600 mt-2 font-medium">Specialized domains based on your stream in {userStream?.name}</p>
              </div>
            </div>
            
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center gap-4 bg-white rounded-3xl border-2 border-gray-50">
                <Loader2 className="animate-spin text-primary" />
                <p className="text-gray-500 italic">Customizing roadmaps...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 perspective-1000">
                {userStream?.subDomains?.map((sd, index) => {
                  // Map sub-domain names to specific background images
                  const getSubDomainImage = (subDomainName) => {
                    const name = subDomainName.toLowerCase();
                    if (name.includes('ai') || name.includes('machine learning')) {
                      return 'https://images.unsplash.com/photo-1677442179019-21780ecad995?w=600&h=400&fit=crop';
                    } else if (name.includes('data science')) {
                      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop';
                    } else if (name.includes('cyber security')) {
                      return 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop';
                    } else if (name.includes('iot') || name.includes('internet of things')) {
                      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop';
                    } else if (name.includes('automotive')) {
                      return 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop';
                    } else if (name.includes('robotics')) {
                      return 'https://images.unsplash.com/photo-1635373067958-d7d165378995?w=600&h=400&fit=crop';
                    } else if (name.includes('structural')) {
                      return 'https://images.unsplash.com/photo-1514432324607-2e467f4af445?w=600&h=400&fit=crop';
                    } else if (name.includes('transportation')) {
                      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop';
                    } else if (name.includes('embedded')) {
                      return 'https://images.unsplash.com/photo-1518611505868-48510c2e022b?w=600&h=400&fit=crop';
                    } else if (name.includes('communication') || name.includes('wireless')) {
                      return 'https://images.unsplash.com/photo-1606933248051-5ce98bebdc0e?w=600&h=400&fit=crop';
                    } else if (name.includes('power systems')) {
                      return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop';
                    } else if (name.includes('renewable')) {
                      return 'https://images.unsplash.com/photo-1509391366360-2e938286db4c?w=600&h=400&fit=crop';
                    }
                    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop';
                  };

                  const subDomainImage = getSubDomainImage(sd.name);

                  return (
                  <AnimatedCard
                    key={sd._id}
                    delay={index * 0.1}
                    className="h-full overflow-hidden"
                  >
                    {/* Sub-Domain Image */}
                    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img
                        src={subDomainImage}
                        alt={sd.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <Compass size={20} className="text-white" />
                      </div>
                      {/* Floating elements */}
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-primary/30 rounded-full blur-sm"></div>
                      <div className="absolute bottom-8 right-8 w-4 h-4 bg-secondary/40 rounded-full blur-sm" style={{ animationDelay: '1s' }}></div>
                    </div>

                    <div className="p-8 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-2xl text-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-secondary group-hover:text-white transition-all duration-300 shadow-lg">
                          <Compass size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">Roadmap Ready</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100 group-hover:text-primary transition-all duration-300">{sd.name}</h3>
                      <p className="text-gray-600 dark:text-slate-300 text-sm mb-8 leading-relaxed line-clamp-3 overflow-hidden flex-grow" style={{ minHeight: '4.5rem' }}>
                        {sd.description}
                      </p>
                      <Link
                        to={activeStream?.slug && sd.slug ? `/streams/${activeStream.slug}/substreams/${sd.slug}` : '/dashboard'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-4 rounded-2xl font-bold hover:from-primary hover:to-secondary transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                      >
                        <span className="relative z-10">Explore Roles</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-secondary/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                  </AnimatedCard>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </PageTransition>
  );
};

export default Dashboard;
