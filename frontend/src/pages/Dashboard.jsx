import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Target, Award, ArrowRight, Loader2, Sparkles, Compass } from 'lucide-react';

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {streams.map((s) => {
              // Map stream names to specific background images
              const getStreamImage = (streamName) => {
                const name = streamName.toLowerCase();
                
                if (name.includes('computer science')) {
                  return 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=450&fit=crop&q=80';
                } else if (name.includes('mechanical')) {
                  return 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=450&fit=crop&q=80';
                } else if (name.includes('civil')) {
                  return 'https://images.unsplash.com/photo-1486621145735-29aeb4a9be3e?w=600&h=450&fit=crop&q=80';
                } else if (name.includes('electronics') && name.includes('communication')) {
                  return 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=450&fit=crop&q=80';
                } else if (name.includes('electrical') && name.includes('electronics')) {
                  return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=450&fit=crop&q=80';
                }
                return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=450&fit=crop&q=80';
              };

              const streamImage = getStreamImage(s.name);

              return (
              <div
                key={s._id}
                onClick={() => handleStreamSelect(s._id)}
                className="group relative bg-white dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Background Image */}
                <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img 
                    src={streamImage}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Compass size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-slate-100 group-hover:text-primary transition">{s.name}</h3>
                  <p className="text-gray-500 dark:text-slate-300 text-sm mb-6 leading-relaxed">{s.description}</p>
                  <div className="flex items-center gap-2 text-primary font-bold">
                    Start Learning <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-12 animate-in fade-in duration-500">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-secondary to-primary p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group">
              <BookOpen className="absolute -right-4 -bottom-4 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" size={120} />
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs opacity-90">Current Track</span>
              </div>
              <div className="text-3xl font-black">{userStream?.name}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-orange-50 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-100 p-2 rounded-lg text-secondary">
                  <Target size={20} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs text-gray-500">Sub-Domains Available</span>
              </div>
              <div className="text-4xl font-black text-gray-900">{userStream?.subDomains?.length || 0}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border-2 border-orange-50 dark:border-slate-800 p-8 rounded-3xl shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-amber-100 p-2 rounded-lg text-accent">
                  <Award size={20} />
                </div>
                <span className="font-bold tracking-wide uppercase text-xs text-gray-500">Overall Progress</span>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-black text-gray-900">
                  {Math.round(
                    (user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) / 
                    Math.max(user?.courseProgress?.length || 1, 1)
                  )}%
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-2 flex-grow overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.round((user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) / Math.max(user?.courseProgress?.length || 1, 1))}%` }}
                  ></div>
                </div>
              </div>
            </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userStream?.subDomains?.map((sd) => {
                  // Map sub-domain names to specific background images
                  const getSubDomainImage = (subDomainName) => {
                    const name = subDomainName.toLowerCase();
                    if (name.includes('ai') || name.includes('machine learning')) {
                      return 'https://images.unsplash.com/photo-1677442179019-21780ecad995?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('data science')) {
                      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('cyber security')) {
                      return 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('iot') || name.includes('internet of things')) {
                      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('automotive')) {
                      return 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('robotics')) {
                      return 'https://images.unsplash.com/photo-1635373067958-d7d165378995?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('structural')) {
                      return 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('transportation')) {
                      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('embedded')) {
                      return 'https://images.unsplash.com/photo-1518611505868-48510c2e022b?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('communication') || name.includes('wireless')) {
                      return 'https://images.unsplash.com/photo-1606933248051-5ce98bebdc0e?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('power systems')) {
                      return 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&h=400&fit=crop&q=80';
                    } else if (name.includes('renewable')) {
                      return 'https://images.unsplash.com/photo-1509391366360-2e938286db4c?w=600&h=400&fit=crop&q=80';
                    }
                    return 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&q=80';
                  };

                  const subDomainImage = getSubDomainImage(sd.name);

                  return (
                  <div key={sd._id} className="group bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    {/* Sub-Domain Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                      <img 
                        src={subDomainImage}
                        alt={sd.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-primary/10 p-4 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Compass size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-400">Roadmap Ready</span>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-slate-100 group-hover:text-primary transition">{sd.name}</h3>
                      <p className="text-gray-600 dark:text-slate-300 text-sm mb-8 leading-relaxed line-clamp-3 overflow-hidden" style={{ minHeight: '4.5rem' }}>
                        {sd.description}
                      </p>
                      <Link
                        to={activeStream?.slug && sd.slug ? `/streams/${activeStream.slug}/substreams/${sd.slug}` : '/dashboard'}
                        className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30"
                      >
                        Explore Roles <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
