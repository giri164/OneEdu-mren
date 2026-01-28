import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Menu, X, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { Link } from 'react-router-dom';

const SidePanel = () => {
  const { user } = useAuth();
  const [isStreamListOpen, setIsStreamListOpen] = useState(true);
  const [streams, setStreams] = useState([]);
  const [expandedStreams, setExpandedStreams] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/user/streams');
        setStreams(data.data);
        
        // Auto-expand user's selected stream
        if (user?.stream) {
          setExpandedStreams({ [user.stream]: true });
        }
      } catch (error) {
        console.error('Error fetching streams:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStreams();
    }
  }, [user]);

  const toggleStream = (streamId) => {
    setExpandedStreams(prev => ({
      ...prev,
      [streamId]: !prev[streamId]
    }));
  };

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden bg-primary text-white p-3 rounded-full shadow-lg hover:bg-secondary transition-all"
        title="Toggle side panel"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Side Panel */}
      <aside
        className="fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 transition-all duration-300 overflow-y-auto z-40 md:translate-x-0"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                <BookOpen size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                Learning Paths
              </h2>
            </div>
            <button
              onClick={() => setIsStreamListOpen(!isStreamListOpen)}
              className="hidden md:flex p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition"
              title="Toggle streams list"
            >
              {isStreamListOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Streams List */}
          {isStreamListOpen && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : streams.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-slate-400 text-sm">No streams available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {streams.map(stream => {
                    const isExpanded = expandedStreams[stream._id];
                    const isUserStream = user?.stream === stream._id;

                    return (
                      <div key={stream._id} className="space-y-2">
                        {/* Stream Item */}
                        <button
                          onClick={() => toggleStream(stream._id)}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                            isUserStream
                              ? 'bg-primary/10 border border-primary/30 dark:border-primary/50'
                              : 'hover:bg-gray-50 dark:hover:bg-slate-800 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1 text-left">
                            <div className={`p-2 rounded-lg ${
                              isUserStream
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300'
                            }`}>
                              <BookOpen size={16} />
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${
                                isUserStream
                                  ? 'text-primary dark:text-amber-200'
                                  : 'text-gray-900 dark:text-slate-100'
                              }`}>
                                {stream.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                {stream.subDomains?.length || 0} paths
                              </p>
                            </div>
                          </div>
                          <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                            <ChevronDown size={16} className="text-gray-400" />
                          </div>
                        </button>

                        {/* Sub-Domains List */}
                        {isExpanded && stream.subDomains && stream.subDomains.length > 0 && (
                          <div className="ml-4 space-y-1 border-l-2 border-gray-200 dark:border-slate-700 pl-3">
                            {stream.subDomains.map(subDomain => (
                              <Link
                                key={subDomain._id}
                                to={`/streams/${stream.slug}/substreams/${subDomain.slug}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="block px-3 py-2 text-sm rounded-lg text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors hover:text-primary dark:hover:text-amber-200"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
                                  <span className="truncate font-medium">{subDomain.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {isExpanded && (!stream.subDomains || stream.subDomains.length === 0) && (
                          <div className="ml-4 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 italic">
                            No learning paths yet
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </aside>

      {/* Main content spacer on desktop */}
      <div className="hidden md:block w-80"></div>
    </>
  );
};

export default SidePanel;
