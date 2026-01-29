import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, CheckCircle2, Circle, ExternalLink, 
  DollarSign, Building2, BookCheck, AlertCircle, Zap
} from 'lucide-react';

const RoleDetails = () => {
  const { id } = useParams();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingCourse, setUpdatingCourse] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await API.get(`/user/role-details/${id}`);
        setRole(data.data);
      } catch (error) {
        console.error('Error fetching role details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleCourseProgress = async (courseId, completionPercentage, isCompleted) => {
    setUpdatingCourse(courseId);
    try {
      const { data: progressData } = await API.post('/user/course-progress', {
        courseId,
        completionPercentage,
        isCompleted
      });
      // Update global user context with new progress data
      updateUser(progressData.data);
      
      // Refresh role details to get updated progress within course list
      const { data } = await API.get(`/user/role-details/${id}`);
      setRole(data.data);
    } catch (error) {
      console.error('Course progress error:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to update course progress: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingCourse(null);
    }
  };

  const getCourseProgress = (courseId) => {
    const progress = user?.courseProgress?.find(cp => cp.course === courseId);
    return progress || { completionPercentage: 0, isCompleted: false };
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading detailed roadmap...</div>;
  if (!role) return <div className="p-10 text-center text-red-600">Role not found.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-[calc(100vh-200px)] pt-24 pb-32">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-primary hover:text-secondary mb-8 font-bold transition">
        <ArrowLeft size={20} /> Back to Roles
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Header with Background Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl h-80">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-696ce0213d3a?w=1200&h=400&fit=crop&q=80"
              alt="Role header"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/70"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <h1 className="text-4xl font-extrabold mb-4">{role.title}</h1>
              <p className="text-xl text-blue-100 leading-relaxed">{role.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {role.skills.map((skill) => (
                  <span key={skill} className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills & Courses Roadmap */}
          <section>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <BookCheck className="text-primary" size={32} /> Complete Learning Roadmap
            </h2>
            <div className="space-y-8">
              {role.skills.map((skill) => {
                const skillCourses = role.courses.filter(c => c.skill === skill);
                return (
                  <div key={skill} className="border-l-4 border-primary pl-6">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">{skill}</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {skillCourses.map((course) => {
                        // Use progress from course object (refetched) or fallback to user context
                        const progress = course.progress || getCourseProgress(course._id);
                        const completionPct = progress?.completionPercentage || 0;
                        const isCompleted = progress?.isCompleted || false;

                        return (
                          <div
                            key={course._id}
                            className="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary transition-all shadow-sm hover:shadow-lg overflow-hidden group"
                          >
                            {/* Course Header */}
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white group-hover:from-primary/5 transition">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition flex-1">
                                  {course.title}
                                </h4>
                                <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                                  course.type === 'Paid'
                                    ? 'bg-amber-100 text-amber-700' 
                                    : 'bg-green-100 text-green-700'
                                }`}>
                                  {course.type === 'Paid' ? '💰 Paid' : '🎁 Free'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{course.provider} • {course.duration}</p>
                              {course.type === 'Paid' && course.amount !== undefined && course.amount !== null && (
                                <div className="flex items-center gap-1 text-sm font-bold text-amber-600 mt-1">
                                  <DollarSign size={14} /> {course.amount}
                                </div>
                              )}
                            </div>

                            {/* Progress Section */}
                            <div className="px-6 py-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">Progress</span>
                                <span className={`text-lg font-bold ${completionPct === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                                  {completionPct}%
                                </span>
                              </div>
                              
                              {/* Progress Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    completionPct === 100 ? 'bg-green-500' : 'bg-primary'
                                  }`}
                                  style={{ width: `${completionPct}%` }}
                                ></div>
                              </div>

                              {/* Progress Controls */}
                              <div className="flex gap-2 mb-4">
                                {[25, 50, 75, 100].map((pct) => (
                                  <button
                                    key={pct}
                                    onClick={() => handleCourseProgress(course._id, pct, pct === 100)}
                                    disabled={updatingCourse === course._id}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                      completionPct === pct
                                        ? 'bg-primary text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } disabled:opacity-50`}
                                  >
                                    {pct}%
                                  </button>
                                ))}
                              </div>

                              {/* Completion Checkbox */}
                              <button
                                onClick={() => handleCourseProgress(course._id, isCompleted ? 0 : 100, !isCompleted)}
                                disabled={updatingCourse === course._id}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50`}
                              >
                                {isCompleted ? (
                                  <>
                                    <CheckCircle2 size={20} /> Completed!
                                  </>
                                ) : (
                                  <>
                                    <Circle size={20} /> Mark Complete
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Course Description & Link */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                              
                              {/* New: Certifications and Target Companies */}
                              {(course.certifications?.length > 0 || course.targetCompanies?.length > 0) && (
                                <div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 space-y-3">
                                  {course.certifications?.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Recommended Certifications</h5>
                                      <div className="space-y-1">
                                        {course.certifications.map((cert, i) => (
                                          <a 
                                            key={i} 
                                            href={cert.link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-xs font-semibold text-primary hover:underline"
                                          >
                                            <span>• {cert.name}</span>
                                              <span className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${cert.type === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                  {cert.type}
                                                </span>
                                                {cert.type === 'Paid' && cert.amount !== undefined && cert.amount !== null && (
                                                  <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1"><DollarSign size={10} />{cert.amount}</span>
                                                )}
                                              </span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {course.targetCompanies?.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Companies Asking for this</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {course.targetCompanies.map((company, i) => (
                                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                                            {company}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary transition shadow-md"
                              >
                                Go to Course <ExternalLink size={18} />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {/* Uncategorized Courses Section */}
              {role.courses.some(c => !role.skills.includes(c.skill)) && (
                <div className="border-l-4 border-amber-400 pl-6 mt-12">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                    <BookCheck className="text-amber-500" size={24} /> Supplementary Learning
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {role.courses.filter(c => !role.skills.includes(c.skill)).map((course) => {
                      const progress = course.progress || getCourseProgress(course._id);
                      const completionPct = progress?.completionPercentage || 0;
                      const isCompleted = progress?.isCompleted || false;
                      
                      return (
                        <div key={course._id} className="bg-white rounded-2xl border-2 border-gray-100 hover:border-amber-400 transition-all shadow-sm hover:shadow-lg overflow-hidden group">
                            {/* Course Header */}
                            <div className="p-6 bg-gradient-to-r from-gray-50 to-white group-hover:from-amber-50 transition">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition flex-1">
                                  {course.title}
                                </h4>
                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full whitespace-nowrap ml-2 bg-amber-100 text-amber-700`}>
                                  {course.skill}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{course.provider} • {course.duration}</p>
                              {course.type === 'Paid' && course.amount !== undefined && course.amount !== null && (
                                <div className="flex items-center gap-1 text-sm font-bold text-amber-600 mt-1">
                                  <DollarSign size={14} /> {course.amount}
                                </div>
                              )}
                            </div>

                            {/* Progress Section */}
                            <div className="px-6 py-4 border-t border-gray-100">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-gray-700">Progress</span>
                                <span className={`text-lg font-bold ${completionPct === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                                  {completionPct}%
                                </span>
                              </div>
                              
                              <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    completionPct === 100 ? 'bg-green-500' : 'bg-amber-400'
                                  }`}
                                  style={{ width: `${completionPct}%` }}
                                ></div>
                              </div>

                              <div className="flex gap-2 mb-4">
                                {[25, 50, 75, 100].map((pct) => (
                                  <button
                                    key={pct}
                                    onClick={() => handleCourseProgress(course._id, pct, pct === 100)}
                                    disabled={updatingCourse === course._id}
                                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                                      completionPct === pct
                                        ? 'bg-amber-500 text-white shadow-md scale-105'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    } disabled:opacity-50`}
                                  >
                                    {pct}%
                                  </button>
                                ))}
                              </div>

                              <button
                                onClick={() => handleCourseProgress(course._id, isCompleted ? 0 : 100, !isCompleted)}
                                disabled={updatingCourse === course._id}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                  isCompleted
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                } disabled:opacity-50`}
                              >
                                {isCompleted ? <><CheckCircle2 size={20} /> Done!</> : <><Circle size={20} /> Mark Complete</>}
                              </button>
                            </div>

                            {/* Link section */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                              
                              {/* New: Certifications and Target Companies */}
                              {(course.certifications?.length > 0 || course.targetCompanies?.length > 0) && (
                                <div className="mb-4 p-4 bg-white rounded-xl border border-gray-100 space-y-3">
                                  {course.certifications?.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Recommended Certifications</h5>
                                      <div className="space-y-1">
                                        {course.certifications.map((cert, i) => (
                                          <a 
                                            key={i} 
                                            href={cert.link} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center justify-between text-xs font-semibold text-primary hover:underline"
                                          >
                                            <span>• {cert.name}</span>
                                            <span className="flex items-center gap-2">
                                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${cert.type === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                {cert.type}
                                              </span>
                                              {cert.type === 'Paid' && cert.amount !== undefined && cert.amount !== null && (
                                                <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1"><DollarSign size={10} />{cert.amount}</span>
                                              )}
                                            </span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {course.targetCompanies?.length > 0 && (
                                    <div>
                                      <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Companies Asking for this</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {course.targetCompanies.map((company, i) => (
                                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                                            {company}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <a
                                href={course.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary transition shadow-md"
                              >
                                Go to Course <ExternalLink size={18} />
                              </a>
                            </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar: Jobs & Analytics */}
        <div className="space-y-8">
          {/* Overall Progress */}
          <section className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 border-2 border-primary/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-primary">
              <Zap size={28} /> Your Progress
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-700">Overall Completion</span>
                  <span className="text-2xl font-extrabold text-primary">
                    {Math.round(
                      (user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) / 
                      Math.max(user?.courseProgress?.length || 1, 1)
                    )}%
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-4 overflow-hidden border border-primary/20">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (user?.courseProgress?.reduce((sum, cp) => sum + (cp.completionPercentage || 0), 0) || 0) / 
                        Math.max(user?.courseProgress?.length || 1, 1)
                      )}%`
                    }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-green-200">
                  <div className="text-2xl font-bold text-green-600">
                    {user?.courseProgress?.filter(cp => cp.isCompleted)?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold">Completed Courses</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {role?.courses?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600 font-semibold">Total Courses</div>
                </div>
              </div>
            </div>
          </section>

          {/* Job Market Trends */}
          <section className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 size={28} className="text-yellow-400" /> Job Market
            </h3>
            <div className="space-y-4">
              {role.jobs.slice(0, 3).map((job, idx) => (
                <div key={idx} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                  <div className="font-bold text-lg text-white mb-1">{job.company}</div>
                  <div className="text-sm text-gray-400 mb-2">{job.location}</div>
                  <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg">
                    <DollarSign size={18} className="text-green-400" />
                    <span className="font-bold text-green-400">{job.salaryRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Card */}
          <section className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200">
            <div className="flex gap-4">
              <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Pro Tip</h4>
                <p className="text-sm text-amber-800">
                  Complete courses progressively. Start with free resources, then invest in paid courses for deeper knowledge.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RoleDetails;
