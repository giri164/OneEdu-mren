import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Search, BookOpen, Briefcase, Users, X, ExternalLink, Plus } from 'lucide-react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    courses: [],
    jobs: [],
    roles: [],
    streams: []
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [applyingTo, setApplyingTo] = useState(null);
  const navigate = useNavigate();

  const searchData = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ courses: [], jobs: [], roles: [], streams: [] });
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.get(`/user/search?q=${encodeURIComponent(searchQuery)}`);
      setResults(data.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchData(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults({ courses: [], jobs: [], roles: [], streams: [] });
  };

  const handleApply = async (jobId) => {
    setApplyingTo(jobId);
    try {
      await API.post('/user/jobs/apply', { jobId });
      alert('Application submitted successfully!');
      // Optionally refresh search results or navigate to applications
    } catch (error) {
      console.error('Error applying for job:', error);
      alert(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplyingTo(null);
    }
  };

  const getFilteredResults = () => {
    if (activeTab === 'all') return results;
    return { [activeTab]: results[activeTab] || [], total: results[activeTab]?.length || 0 };
  };

  const filteredResults = getFilteredResults();

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Search OneEdu
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for courses, jobs, roles, streams..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Tabs */}
        {query && (
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-slate-700">
              {[
                { key: 'all', label: 'All', icon: Search },
                { key: 'courses', label: 'Courses', icon: BookOpen },
                { key: 'jobs', label: 'Jobs', icon: Briefcase },
                { key: 'roles', label: 'Roles', icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {key !== 'all' && results[key] && (
                    <span className="bg-gray-100 dark:bg-slate-700 text-xs px-2 py-1 rounded-full">
                      {results[key].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-slate-400 mt-4">Searching...</p>
          </div>
        ) : query ? (
          <div className="space-y-8">
            {/* Courses */}
            {(activeTab === 'all' || activeTab === 'courses') && filteredResults.courses?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  Courses ({filteredResults.courses.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.courses.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => navigate(`/role/${course.role._id}`)}
                      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition">
                          {course.title}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          course.type === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {course.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                        {course.provider} • {course.duration}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-slate-500">
                        Role: {course.role.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jobs */}
            {(activeTab === 'all' || activeTab === 'jobs') && filteredResults.jobs?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-primary" />
                  Jobs ({filteredResults.jobs.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredResults.jobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                            {job.title}
                          </h3>
                          <p className="text-primary font-medium">{job.company}</p>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {job.location}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                        Role: {job.role.title}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-green-600">{job.salary}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApply(job._id);
                            }}
                            disabled={applyingTo === job._id}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition flex items-center gap-1 disabled:opacity-50"
                          >
                            {applyingTo === job._id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            Apply
                          </button>
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-secondary transition"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Roles */}
            {(activeTab === 'all' || activeTab === 'roles') && filteredResults.roles?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  Roles ({filteredResults.roles.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.roles.map((role) => (
                    <div
                      key={role._id}
                      onClick={() => navigate(`/role/${role._id}`)}
                      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
                        {role.subDomain.name} • {role.subDomain.stream.name}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {role.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {role.skills.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{role.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {Object.values(filteredResults).every(arr => !Array.isArray(arr) || arr.length === 0) && !loading && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-slate-400">
                  Try adjusting your search terms or browse our categories.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              Start searching
            </h3>
            <p className="text-gray-600 dark:text-slate-400">
              Search for courses, jobs, roles, and career paths to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;