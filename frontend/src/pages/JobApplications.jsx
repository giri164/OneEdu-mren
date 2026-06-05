import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Briefcase, Calendar, MapPin, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/user/jobs/applications');
      setApplications(data.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'interviewing':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'offered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'withdrawn':
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800';
      case 'offered':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (!confirm('Are you sure you want to withdraw this application?')) return;

    try {
      await API.put(`/user/jobs/applications/${applicationId}`, {
        status: 'withdrawn'
      });
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-slate-950 dark:text-slate-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-slate-400 mt-4">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950 dark:text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Job Applications
          </h1>
          <p className="text-gray-600 dark:text-slate-400">
            Track and manage your job applications
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 dark:text-slate-400 mb-6">
              Start applying for jobs to see your applications here.
            </p>
            <a
              href="/search"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition"
            >
              <Briefcase className="w-5 h-5" />
              Browse Jobs
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(application.status)}
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-slate-400">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                    {application.job.title}
                  </h3>
                  <p className="text-primary font-medium mb-2">{application.job.company}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {application.job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {application.job.salary}
                    </div>
                  </div>
                </div>

                {application.notes && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Notes</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{application.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <a
                    href={application.job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-primary text-white text-center py-2 px-4 rounded-lg hover:bg-secondary transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Job
                  </a>
                  {application.status === 'applied' && (
                    <button
                      onClick={() => handleWithdraw(application._id)}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;