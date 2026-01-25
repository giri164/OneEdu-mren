import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  ArrowLeft,
  Briefcase,
  ChevronRight,
  Loader2,
  Award,
  Clock,
  ListChecks,
  ExternalLink,
  Video,
  BookOpen,
  Sparkles,
  TrendingUp
} from 'lucide-react';

const SubStreamDetails = () => {
  const { streamSlug, subStreamSlug } = useParams();
  const navigate = useNavigate();
  const [context, setContext] = useState(null);
  const [roles, setRoles] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await API.get(`/user/streams/${streamSlug}/substreams/${subStreamSlug}/courses`);
        const payload = data.data;
        setContext(payload);
        setRoles(payload?.roles || []);
        setJobs(payload?.jobs || []);
      } catch (err) {
        console.error('Sub-stream fetch error:', err);
        setError(err.response?.data?.message || 'Unable to load this specialization right now.');
        if (err.response?.status === 404) {
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [streamSlug, subStreamSlug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-2" size={32} />
        <p className="text-gray-500">Curating learning paths...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Link to="/dashboard" className="text-primary font-bold">Return to dashboard</Link>
      </div>
    );
  }

  const { stream, subStream, courses } = context || {};

  return (
    <div className="min-h-screen bg-[#f7f1e8] dark:bg-slate-950 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
        >
          <ArrowLeft size={18} /> Back to dashboard
        </Link>

        <section
          className="relative overflow-hidden rounded-3xl border border-orange-100 dark:border-slate-800 bg-gradient-to-br from-white via-[#fff8ef] to-[#ffe8cc] dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 p-6 sm:p-10 shadow-[0_15px_45px_rgba(255,153,0,0.08)]"
        >
          <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
          <div className="space-y-4 relative z-10">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white/70 dark:bg-slate-800 px-4 py-1 text-xs font-semibold text-amber-600">{stream?.name}</span>
              <span className="rounded-full border border-amber-200 dark:border-slate-700 px-4 py-1 text-xs text-slate-500 dark:text-slate-300">Roadmap companion</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">{subStream?.name}</h1>
            <p className="text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-3xl">{subStream?.description}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 p-4">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="rounded-full bg-slate-100 p-2">
                  <Clock className="text-slate-600" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Suggested pace</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {subStream?.durationWeeks || '---'} weeks
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-start gap-3 text-slate-700">
                <div className="rounded-full bg-amber-50 p-2">
                  <ListChecks className="text-amber-500" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Helpful foundations</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {(subStream?.prerequisites || ['Open to motivated learners']).map((item) => (
                      <li key={item} className="rounded-full border border-amber-200/70 bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-start gap-3 text-slate-700">
                <div className="rounded-full bg-emerald-50 p-2">
                  <Award className="text-emerald-500" size={18} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">What you leave with</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {(subStream?.skillOutcomes || ['Specialist portfolio']).map((item) => (
                      <li key={item} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Career roles</p>
            <h2 className="text-2xl font-semibold text-slate-900">Teams hiring for this craft</h2>
          </div>
          {roles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center text-slate-500 dark:text-slate-300">
              No curated roles yet — check back soon.
            </div>
          ) : (
            <div className="space-y-6">
              {roles.map((role) => (
                <article
                  key={role._id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{role.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{role.description}</p>
                    </div>
                    <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-3">
                      <Briefcase className="text-slate-500 dark:text-slate-300" size={18} />
                    </div>
                  </div>
                  {role.skills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    to={`/role/${role._id}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    View roadmap <ChevronRight size={16} />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Certifications</p>
            <h2 className="text-2xl font-semibold text-slate-900">Exam picks that employers value</h2>
          </div>
          {subStream?.recommendedCertifications?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subStream.recommendedCertifications.map((cert, idx) => (
                <article key={`${cert.name}-${idx}`} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-amber-50 dark:bg-amber-900/30 p-2 text-amber-600">
                      <Award size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{cert.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{cert.issuer} • {cert.level || 'All levels'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold">Exam fee: {cert.fee || 'Varies'}</span>
                    {cert.examUrl && (
                      <a href={cert.examUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
                        View exam <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center text-slate-500 dark:text-slate-300">
              Certifications coming soon.
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-slate-500">Opportunities</p>
            <h2 className="text-2xl font-semibold text-slate-900">Live-aligned job roles</h2>
          </div>
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Jobs will appear here once mapped.
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job._id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-xs uppercase text-slate-500">{job.role?.title || 'Role aligned'}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                      <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold bg-amber-50 px-3 py-1 rounded-full">
                      <TrendingUp size={14} /> {job.salaryRange || 'Competitive'}
                    </div>
                  </div>
                  {job.description && <p className="text-sm text-slate-600 leading-relaxed">{job.description}</p>}
                  {job.link && (
                    <a href={job.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline">
                      View role <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-3 text-slate-700">
            <BookOpen />
            <div>
              <p className="text-sm text-slate-500">Courses</p>
              <h2 className="text-2xl font-semibold text-slate-900">Learning path</h2>
            </div>
          </div>

          {(!courses || courses.length === 0) ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-10 text-center text-slate-500 dark:text-slate-300">
              No courses mapped yet. Your mentor will add them soon.
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <article key={course._id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{course.level}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${course.type === 'Paid' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {course.type}
                      </span>
                      {course.type === 'Paid' && course.amount !== undefined && course.amount !== null && (
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">{course.amount}</span>
                      )}
                      {course.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-bold">
                          <Sparkles size={14} /> Featured pick
                        </span>
                      )}
                    </div>
                    {course.progress && (
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="font-semibold">{Math.round(course.progress.completionPercentage || 0)}%</span>
                        <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${Math.round(course.progress.completionPercentage || 0)}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{course.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{course.provider}</span>
                    {course.durationLabel && <span className="rounded-full bg-slate-100 px-3 py-1">{course.durationLabel}</span>}
                    {course.skill && <span className="rounded-full bg-slate-100 px-3 py-1">{course.skill}</span>}
                    {course.targetCompanies?.length > 0 && <span className="rounded-full bg-slate-100 px-3 py-1">Targets: {course.targetCompanies.slice(0,2).join(', ')}{course.targetCompanies.length>2 ? '…' : ''}</span>}
                  </div>

                  {course.resourceLinks?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <BookOpen size={14} /> Course links
                      </p>
                      <ul className="space-y-1 text-sm">
                        {course.resourceLinks.map((res, idx) => (
                          <li key={idx} className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">{res.type || 'Free'}</span>
                              {res.type === 'Paid' && res.amount !== undefined && res.amount !== null && (
                                <span className="text-xs font-semibold text-amber-600">{res.amount}</span>
                              )}
                              <span>{res.label || res.provider || 'Resource'}</span>
                            </div>
                            {res.url && (
                              <a href={res.url} target="_blank" rel="noreferrer" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
                                Open <ExternalLink size={12} />
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.videoLinks?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Video size={14} /> Helpful videos
                      </p>
                      <ul className="space-y-1 text-sm">
                        {course.videoLinks.map((video, idx) => (
                          <li key={idx}>
                            <a href={video.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-primary hover:underline">
                              <span>{video.title}</span>
                              <ExternalLink size={14} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.certificateLinks?.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
                        <Award size={14} /> Certificates
                      </p>
                      <ul className="space-y-1 text-sm">
                        {course.certificateLinks.map((cert, idx) => (
                          <li key={idx}>
                            <a href={cert.url} target="_blank" rel="noreferrer" className="flex items-center justify-between text-primary hover:underline">
                              <span className="flex items-center gap-2">
                                {cert.label}
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{cert.type || 'Paid'}</span>
                                {cert.type === 'Paid' && cert.amount !== undefined && cert.amount !== null && (
                                  <span className="text-[11px] font-bold text-amber-700">{cert.amount}</span>
                                )}
                              </span>
                              <ExternalLink size={14} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <a
                    href={course.link || course.resourceLinks?.[0]?.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                  >
                    Launch course <ExternalLink size={16} />
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default SubStreamDetails;
