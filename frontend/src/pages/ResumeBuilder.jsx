import { useState, useEffect } from 'react';
import API from '../api/axios';
import { FileText, Download, Edit, Save, Plus, Trash2 } from 'lucide-react';

const ResumeBuilder = () => {
  const [resume, setResume] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await API.get('/user/resume');
      if (data.data) {
        setResume(data.data);
      }
    } catch (error) {
      // Resume doesn't exist yet, use default
      console.log('No resume found, using default');
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await API.post('/user/resume', resume);
      setEditing(false);
      alert('Resume saved successfully!');
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => {
    setResume({
      ...resume,
      experience: [...resume.experience, {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index][field] = value;
    setResume({ ...resume, experience: updated });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index)
    });
  };

  const addEducation = () => {
    setResume({
      ...resume,
      education: [...resume.education, {
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resume.education];
    updated[index][field] = value;
    setResume({ ...resume, education: updated });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index)
    });
  };

  const addSkill = () => {
    setResume({
      ...resume,
      skills: [...resume.skills, '']
    });
  };

  const updateSkill = (index, value) => {
    const updated = [...resume.skills];
    updated[index] = value;
    setResume({ ...resume, skills: updated });
  };

  const removeSkill = (index) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index)
    });
  };

  const downloadResume = () => {
    // Simple text-based download for now
    const resumeText = `
${resume.personalInfo.name}
${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}
${resume.personalInfo.linkedin} | ${resume.personalInfo.github}

SUMMARY
${resume.summary}

EXPERIENCE
${resume.experience.map(exp => `
${exp.title}
${exp.company}, ${exp.location}
${exp.startDate} - ${exp.endDate}
${exp.description}
`).join('\n')}

EDUCATION
${resume.education.map(edu => `
${edu.degree}
${edu.institution}, ${edu.location}
Graduated: ${edu.graduationDate}
GPA: ${edu.gpa}
`).join('\n')}

SKILLS
${resume.skills.join(', ')}
    `;

    const blob = new Blob([resumeText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume.personalInfo.name.replace(' ', '_')}_Resume.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-slate-950 dark:text-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-gray-600 dark:text-slate-400 mt-4">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-slate-950 dark:text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Resume Builder
            </h1>
            <p className="text-gray-600 dark:text-slate-400">
              Create and manage your professional resume
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(!editing)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Edit className="w-4 h-4" />
              {editing ? 'Preview' : 'Edit'}
            </button>
            <button
              onClick={downloadResume}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          {/* Personal Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={resume.personalInfo.name}
                onChange={(e) => setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo, name: e.target.value }
                })}
                disabled={!editing}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
              />
              <input
                type="email"
                placeholder="Email"
                value={resume.personalInfo.email}
                onChange={(e) => setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo, email: e.target.value }
                })}
                disabled={!editing}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={resume.personalInfo.phone}
                onChange={(e) => setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo, phone: e.target.value }
                })}
                disabled={!editing}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Location"
                value={resume.personalInfo.location}
                onChange={(e) => setResume({
                  ...resume,
                  personalInfo: { ...resume.personalInfo, location: e.target.value }
                })}
                disabled={!editing}
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
              />
            </div>
          </section>

          {/* Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Professional Summary</h2>
            <textarea
              placeholder="Write a brief summary of your professional background..."
              value={resume.summary}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              disabled={!editing}
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
            />
          </section>

          {/* Experience */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Work Experience</h2>
              {editing && (
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              )}
            </div>
            {resume.experience.map((exp, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, 'title', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={exp.location}
                    onChange={(e) => updateExperience(index, 'location', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Start Date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                      disabled={!editing}
                      className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="End Date"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      disabled={!editing}
                      className="flex-1 p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                    />
                  </div>
                </div>
                <textarea
                  placeholder="Job description and achievements..."
                  value={exp.description}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  disabled={!editing}
                  rows={3}
                  className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800 mb-3"
                />
                {editing && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Education */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h2>
              {editing && (
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>
            {resume.education.map((edu, index) => (
              <div key={index} className="mb-4 p-4 border border-gray-200 dark:border-slate-600 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Degree/Program"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  <input
                    type="text"
                    placeholder="Graduation Date"
                    value={edu.graduationDate}
                    onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                    disabled={!editing}
                    className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                </div>
                {editing && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800 transition mt-3"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </section>

          {/* Skills */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills</h2>
              {editing && (
                <button
                  onClick={addSkill}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    disabled={!editing}
                    className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-800"
                  />
                  {editing && (
                    <button
                      onClick={() => removeSkill(index)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Save Button */}
          {editing && (
            <div className="flex justify-center">
              <button
                onClick={saveResume}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border border-white border-t-transparent"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;