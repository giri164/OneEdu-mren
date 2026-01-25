import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, Trash2, Edit, LayoutGrid, 
  MessageSquare, BookOpen, Star, X, Save, Loader2, Compass
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState({
    streams: [],
    courses: [],
    feedback: [],
    allRoles: []
  });
  const [subDomains, setSubDomains] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    skill: '',
    type: 'Free',
    provider: '',
    duration: '',
    link: '',
    description: '',
    stream: '',
    subDomain: '',
    role: '',
    certifications: [],
    targetCompanies: []
  });
  const [newCert, setNewCert] = useState({ name: '', type: 'Free', link: '' });
  const [newCompany, setNewCompany] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const [streamsRes, coursesRes, feedbackRes, rolesRes] = await Promise.all([
        API.get('/user/streams'),
        API.get('/admin/courses'),
        API.get('/admin/feedback'),
        API.get('/admin/roles')
      ]);
      
      setData({
        streams: streamsRes.data.data,
        courses: coursesRes.data.data,
        feedback: feedbackRes.data.data,
        allRoles: rolesRes.data.data
      });
      setSubDomains([]);
      setRoles([]);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
      alert('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStream = async (id) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await API.delete(`/admin/streams/${id}`);
        fetchAdminData();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleDeleteRole = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await API.delete(`/admin/roles/${id}`);
        fetchAdminData();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await API.delete(`/admin/courses/${id}`);
        fetchAdminData();
      } catch (err) {
        alert('Failed to delete course');
      }
    }
  };

  const openAddCourseModal = () => {
    setModalMode('add');
    setCurrentCourse(null);
    setFormData({
      title: '',
      skill: '',
      type: 'Free',
      provider: '',
      duration: '',
      link: '',
      description: '',
      stream: '',
      subDomain: '',
      role: '',
      certifications: [],
      targetCompanies: []
    });
    setNewCert({ name: '', type: 'Free', link: '' });
    setNewCompany('');
    setShowModal(true);
  };

  const openEditCourseModal = (course) => {
    setModalMode('edit');
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      skill: course.skill,
      type: course.type,
      provider: course.provider,
      duration: course.duration,
      link: course.link,
      description: course.description,
      stream: course.stream || '',
      subDomain: course.subDomain || '',
      role: course.role || '',
      certifications: course.certifications || [],
      targetCompanies: course.targetCompanies || []
    });
    setNewCert({ name: '', type: 'Free', link: '' });
    setNewCompany('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStreamChange = async (streamId) => {
    setFormData({ ...formData, stream: streamId, subDomain: '', role: '' });
    setRoles([]);
    if (!streamId) {
      setSubDomains([]);
      return;
    }
    try {
      const { data } = await API.get(`/user/career-path/${streamId}`);
      setSubDomains(data.data.subDomains || []);
    } catch (err) {
      console.error('Failed to load subdomains', err);
      setSubDomains([]);
    }
  };

  const handleSubDomainChange = async (sdId) => {
    setFormData({ ...formData, subDomain: sdId, role: '' });
    if (!sdId) {
      setRoles([]);
      return;
    }
    try {
      const { data } = await API.get(`/user/roles/${sdId}`);
      setRoles(data.data || []);
    } catch (err) {
      console.error('Failed to load roles', err);
      setRoles([]);
    }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        stream: formData.stream || null,
        subDomain: formData.subDomain || null,
        role: formData.role || null
      };
      if (modalMode === 'add') {
        await API.post('/admin/courses', payload);
      } else {
        await API.put(`/admin/courses/${currentCourse._id}`, payload);
      }
      setShowModal(false);
      fetchAdminData();
    } catch (err) {
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  const addCert = () => {
    if (!newCert.name) return;
    setFormData({ ...formData, certifications: [...formData.certifications, newCert] });
    setNewCert({ name: '', type: 'Free', link: '' });
  };

  const removeCert = (index) => {
    const certs = formData.certifications.filter((_, i) => i !== index);
    setFormData({ ...formData, certifications: certs });
  };

  const addCompany = () => {
    if (!newCompany) return;
    if (formData.targetCompanies.includes(newCompany)) return;
    setFormData({ ...formData, targetCompanies: [...formData.targetCompanies, newCompany] });
    setNewCompany('');
  };

  const removeCompany = (company) => {
    const companies = formData.targetCompanies.filter(c => c !== company);
    setFormData({ ...formData, targetCompanies: companies });
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">Admin Dashboard</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
              activeTab === 'courses' ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
          >
            <BookOpen size={20} /> Manage Courses
          </button>
          <button
            onClick={() => setActiveTab('streams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
              activeTab === 'streams' ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
          >
            <LayoutGrid size={20} /> Streams
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
              activeTab === 'roles' ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
          >
            <Compass size={20} /> Roles
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${
              activeTab === 'feedback' ? 'bg-primary text-white' : 'hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={20} /> User Feedback
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'courses' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold">Course Management</h3>
                <button 
                  onClick={openAddCourseModal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition"
                >
                  <PlusCircle size={18} /> Add New Course
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                      <th className="px-6 py-4 font-bold">Title</th>
                      <th className="px-6 py-4 font-bold">Skill</th>
                      <th className="px-6 py-4 font-bold">Type</th>
                      <th className="px-6 py-4 font-bold">Provider</th>
                      <th className="px-6 py-4 font-bold">Duration</th>
                      <th className="px-6 py-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.courses.map((course) => (
                      <tr key={course._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900 max-w-xs truncate">{course.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.skill}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            course.type === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {course.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.provider}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{course.duration}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button 
                              onClick={() => openEditCourseModal(course)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.courses.length === 0 && (
                  <div className="text-center py-20 text-gray-500">
                    No courses yet. Click "Add New Course" to get started.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'streams' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold">Manage Streams</h3>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                    <th className="px-6 py-4 font-bold">Stream Name</th>
                    <th className="px-6 py-4 font-bold">Description</th>
                    <th className="px-6 py-4 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.streams.map((stream) => (
                    <tr key={stream._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{stream.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{stream.description}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteStream(stream._id)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Create Stream & SubDomain */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100">
                <div>
                  <h4 className="font-bold mb-4">Create Stream</h4>
                  <StreamForm onCreated={fetchAdminData} onCancel={() => {}} />
                </div>
                <div>
                  <h4 className="font-bold mb-4">Create SubDomain</h4>
                  <SubDomainForm streams={data.streams} onCreated={fetchAdminData} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-xl font-bold">Manage Roles</h3>
              </div>
              <div className="p-6 border-b border-gray-100">
                <h4 className="font-bold mb-4">Create New Role</h4>
                <RoleForm streams={data.streams} onCreated={fetchAdminData} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm uppercase">
                      <th className="px-6 py-4 font-bold">Role Title</th>
                      <th className="px-6 py-4 font-bold">SubDomain / Stream</th>
                      <th className="px-6 py-4 font-bold">Skills</th>
                      <th className="px-6 py-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.allRoles.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">{r.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {r.subDomain?.name} <span className="text-gray-400">({r.subDomain?.stream?.name})</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {r.skills?.map(s => <span key={s} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleDeleteRole(r._id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-full transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="grid grid-cols-1 gap-6">
              {data.feedback.map((f) => (
                <div key={f._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {f.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="font-bold">{f.user?.name || 'Anonymous'}</div>
                        <div className="text-xs text-gray-500">{new Date(f.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < f.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">"{f.comment}"</p>
                </div>
              ))}
              {data.feedback.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
                  No feedback received yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
              <h3 className="text-2xl font-bold">
                {modalMode === 'add' ? 'Add New Course' : 'Edit Course'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Course Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., Complete Python Bootcamp"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Skill *</label>
                <input
                  type="text"
                  name="skill"
                  required
                  value={formData.skill}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., Python, Machine Learning, Blockchain"
                />
              </div>

              {/* Hierarchy selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Stream</label>
                  <select
                    name="stream"
                    value={formData.stream}
                    onChange={(e) => handleStreamChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="">-- Select Stream --</option>
                    {data.streams.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">SubDomain</label>
                  <select
                    name="subDomain"
                    value={formData.subDomain}
                    onChange={(e) => handleSubDomainChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    disabled={!formData.stream}
                  >
                    <option value="">-- Select SubDomain --</option>
                    {subDomains.map(sd => (
                      <option key={sd._id} value={sd._id}>{sd.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    disabled={!formData.subDomain}
                  >
                    <option value="">-- Select Role --</option>
                    {roles.map(r => (
                      <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type *</label>
                  <select
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  >
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Provider *</label>
                  <input
                    type="text"
                    name="provider"
                    required
                    value={formData.provider}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="e.g., Udemy, Coursera, YouTube"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="e.g., 20 hours, 4 weeks"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Course Link *</label>
                <input
                  type="url"
                  name="link"
                  required
                  value={formData.link}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Relevant Certifications</label>
                  <div className="space-y-2 mb-3">
                    {formData.certifications.map((c, i) => (
                      <div key={i} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
                        <span>{c.name} ({c.type})</span>
                        <button type="button" onClick={() => removeCert(i)} className="text-red-500"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" placeholder="Cert Name" 
                      className="w-full p-2 border rounded text-sm" 
                      value={newCert.name} onChange={(e) => setNewCert({...newCert, name: e.target.value})}
                    />
                    <div className="flex gap-2">
                      <select 
                        className="flex-1 p-2 border rounded text-sm"
                        value={newCert.type} onChange={(e) => setNewCert({...newCert, type: e.target.value})}
                      >
                        <option value="Free">Free</option>
                        <option value="Paid">Paid</option>
                      </select>
                      <button type="button" onClick={addCert} className="bg-blue-600 text-white px-3 rounded"><PlusCircle size={16}/></button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Target Companies</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.targetCompanies.map((c, i) => (
                      <span key={i} className="bg-white px-2 py-1 rounded border text-xs flex items-center gap-1">
                        {c} <button type="button" onClick={() => removeCompany(c)} className="text-red-500"><X size={12}/></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder="e.g. Google, Amazon" 
                      className="flex-1 p-2 border rounded text-sm" 
                      value={newCompany} onChange={(e) => setNewCompany(e.target.value)}
                    />
                    <button type="button" onClick={addCompany} className="bg-blue-600 text-white px-3 rounded"><PlusCircle size={16}/></button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the course..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Course</>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Helper Forms ---
const StreamForm = ({ onCreated, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/admin/streams', { name, description });
      onCreated?.();
      onCancel?.();
      setName(''); setDescription('');
    } catch {
      alert('Failed to create stream');
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Stream Name *</label>
        <input className="w-full px-4 py-3 border rounded-lg" value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
        <textarea className="w-full px-4 py-3 border rounded-lg" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} required />
      </div>
      <div className="flex gap-3">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold" disabled={saving}>Create</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg font-bold">Cancel</button>
        )}
      </div>
    </form>
  );
};

const SubDomainForm = ({ streams, onCreated }) => {
  const [stream, setStream] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/admin/subdomains', { name, description, stream });
      onCreated?.();
      setStream(''); setName(''); setDescription('');
    } catch {
      alert('Failed to create subdomain');
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Stream *</label>
        <select className="w-full px-4 py-3 border rounded-lg" value={stream} onChange={(e)=>setStream(e.target.value)} required>
          <option value="">-- Select Stream --</option>
          {streams.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">SubDomain Name *</label>
        <input className="w-full px-4 py-3 border rounded-lg" value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
        <textarea className="w-full px-4 py-3 border rounded-lg" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} required />
      </div>
      <button type="submit" disabled={saving} className="bg-primary text-white px-4 py-2 rounded-lg font-bold">Create SubDomain</button>
    </form>
  );
};

const RoleForm = ({ streams, onCreated }) => {
  const [stream, setStream] = useState('');
  const [subDomain, setSubDomain] = useState('');
  const [subDomains, setSubDomains] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!stream) { setSubDomains([]); setSubDomain(''); return; }
      try {
        const { data } = await API.get(`/user/career-path/${stream}`);
        setSubDomains(data.data.subDomains || []);
      } catch {
        setSubDomains([]);
      }
    };
    load();
  }, [stream]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
      await API.post('/admin/roles', { title, description, subDomain, skills });
      onCreated?.();
      setStream(''); setSubDomain(''); setSubDomains([]);
      setTitle(''); setDescription(''); setSkillsText('');
    } catch {
      alert('Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Stream *</label>
          <select className="w-full px-4 py-3 border rounded-lg" value={stream} onChange={(e)=>setStream(e.target.value)} required>
            <option value="">-- Select Stream --</option>
            {streams.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">SubDomain *</label>
          <select className="w-full px-4 py-3 border rounded-lg" value={subDomain} onChange={(e)=>setSubDomain(e.target.value)} required disabled={!stream}>
            <option value="">-- Select SubDomain --</option>
            {subDomains.map(sd => <option key={sd._id} value={sd._id}>{sd.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Role Title *</label>
        <input className="w-full px-4 py-3 border rounded-lg" value={title} onChange={(e)=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
        <textarea className="w-full px-4 py-3 border rounded-lg" rows={3} value={description} onChange={(e)=>setDescription(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Skills (comma-separated)</label>
        <input className="w-full px-4 py-3 border rounded-lg" value={skillsText} onChange={(e)=>setSkillsText(e.target.value)} placeholder="e.g., HTML, CSS, JavaScript" />
      </div>

      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold" disabled={saving}>Create Role</button>
    </form>
  );
};

export default AdminDashboard;
