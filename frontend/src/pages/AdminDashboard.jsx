import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  PlusCircle,
  Trash2,
  Edit,
  LayoutGrid,
  MessageSquare,
  BookOpen,
  Star,
  X,
  Save,
  Loader2,
  Compass
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('courses');
  const [data, setData] = useState({ streams: [], courses: [], feedback: [], allRoles: [] });
  const [subDomains, setSubDomains] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentCourse, setCurrentCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    skill: '',
    type: 'Free',
    amount: '',
    provider: '',
    duration: '',
    link: '',
    resourceLinks: [],
    description: '',
    stream: '',
    subDomain: '',
    role: '',
    certificateLinks: [],
    targetCompanies: []
  });
  const [newCourseLink, setNewCourseLink] = useState({ label: '', url: '', provider: '', type: 'Free', amount: '' });
  const [newCertLink, setNewCertLink] = useState({ label: '', url: '', type: 'Paid', amount: '' });
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

  const openAddCourseModal = () => {
    setModalMode('add');
    setCurrentCourse(null);
    setFormData({
      title: '',
      skill: '',
      type: 'Free',
      amount: '',
      provider: '',
      duration: '',
      link: '',
      resourceLinks: [],
      description: '',
      stream: '',
      subDomain: '',
      role: '',
      certificateLinks: [],
      targetCompanies: []
    });
    setNewCourseLink({ label: '', url: '', provider: '', type: 'Free', amount: '' });
    setNewCertLink({ label: '', url: '', type: 'Paid', amount: '' });
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
      amount: course.amount || '',
      provider: course.provider,
      duration: course.duration,
      link: course.link,
      resourceLinks: course.resourceLinks || [],
      description: course.description,
      stream: course.stream || '',
      subDomain: course.subDomain || '',
      role: course.role || '',
      certificateLinks: course.certificateLinks || [],
      targetCompanies: course.targetCompanies || []
    });
    setNewCourseLink({ label: '', url: '', provider: '', type: 'Free', amount: '' });
    setNewCertLink({ label: '', url: '', type: 'Paid', amount: '' });
    setNewCompany('');
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'type' && value === 'Free') {
      setFormData({ ...formData, type: value, amount: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStreamChange = async (streamId) => {
    setFormData({ ...formData, stream: streamId, subDomain: '', role: '' });
    setRoles([]);
    if (!streamId) { setSubDomains([]); return; }
    try {
      const { data } = await API.get(`/user/career-path/${streamId}`);
      setSubDomains(data.data.subDomains || []);
    } catch (err) {
      setSubDomains([]);
    }
  };

  const handleSubDomainChange = async (sdId) => {
    setFormData({ ...formData, subDomain: sdId, role: '' });
    if (!sdId) { setRoles([]); return; }
    try {
      const { data } = await API.get(`/user/roles/${sdId}`);
      setRoles(data.data || []);
    } catch (err) {
      setRoles([]);
    }
  };

  const handleDeleteStream = async (id) => {
    if (!window.confirm('Delete this stream?')) return;
    try { await API.delete(`/admin/streams/${id}`); fetchAdminData(); } catch { alert('Delete failed'); }
  };

  const handleDeleteRole = async (id) => {
    if (!window.confirm('Delete this role?')) return;
    try { await API.delete(`/admin/roles/${id}`); fetchAdminData(); } catch { alert('Delete failed'); }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await API.delete(`/admin/courses/${id}`); fetchAdminData(); } catch { alert('Failed to delete course'); }
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!formData.link) { alert('Primary course link is required'); return; }
    if (formData.resourceLinks.length > 4) { alert('Max 4 extra links'); return; }
    if (formData.certificateLinks.length > 5) { alert('Max 5 certification links'); return; }
    if (formData.type === 'Paid' && (!formData.amount || Number(formData.amount) <= 0)) {
      alert('Please provide amount for paid courses');
      return;
    }
    const paidResourceMissing = formData.resourceLinks.some((r) => r.type === 'Paid' && (!r.amount || Number(r.amount) <= 0));
    const paidCertMissing = formData.certificateLinks.some((c) => c.type === 'Paid' && (!c.amount || Number(c.amount) <= 0));
    if (paidResourceMissing) { alert('Add amount for paid course links'); return; }
    if (paidCertMissing) { alert('Add amount for paid certifications'); return; }
    setSaving(true);
    try {
      const normalizedResourceLinks = formData.resourceLinks.map((r) => ({
        ...r,
        amount: r.type === 'Paid' ? Number(r.amount) || 0 : 0
      }));
      const normalizedCertificateLinks = formData.certificateLinks.map((c) => ({
        ...c,
        amount: c.type === 'Paid' ? Number(c.amount) || 0 : 0
      }));
      const payload = {
        ...formData,
        amount: formData.type === 'Paid' ? Number(formData.amount) : 0,
        resourceLinks: normalizedResourceLinks,
        certificateLinks: normalizedCertificateLinks,
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
        <div className="w-full md:w-64 space-y-2">
          <SidebarButton label="Manage Courses" icon={<BookOpen size={20} />} active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} />
          <SidebarButton label="Streams" icon={<LayoutGrid size={20} />} active={activeTab === 'streams'} onClick={() => setActiveTab('streams')} />
          <SidebarButton label="Roles" icon={<Compass size={20} />} active={activeTab === 'roles'} onClick={() => setActiveTab('roles')} />
          <SidebarButton label="User Feedback" icon={<MessageSquare size={20} />} active={activeTab === 'feedback'} onClick={() => setActiveTab('feedback')} />
        </div>

        <div className="flex-1">
          {activeTab === 'courses' && <CoursesPanel data={data} onAdd={openAddCourseModal} onEdit={openEditCourseModal} onDelete={handleDeleteCourse} />}
          {activeTab === 'streams' && <StreamsPanel data={data.streams} onDelete={handleDeleteStream} refresh={fetchAdminData} />}
          {activeTab === 'roles' && <RolesPanel data={data.allRoles} streams={data.streams} onDelete={handleDeleteRole} refresh={fetchAdminData} />}
          {activeTab === 'feedback' && <FeedbackPanel feedback={data.feedback} />}
        </div>
      </div>

      {showModal && (
        <CourseModal
          mode={modalMode}
          formData={formData}
          setFormData={setFormData}
          subDomains={subDomains}
          streams={data.streams}
          roles={roles}
          setShowModal={setShowModal}
          handleSaveCourse={handleSaveCourse}
          handleFormChange={handleFormChange}
          handleStreamChange={handleStreamChange}
          handleSubDomainChange={handleSubDomainChange}
          newCourseLink={newCourseLink}
          setNewCourseLink={setNewCourseLink}
          newCertLink={newCertLink}
          setNewCertLink={setNewCertLink}
          newCompany={newCompany}
          setNewCompany={setNewCompany}
          addCompany={addCompany}
          removeCompany={removeCompany}
          setShowLinksError={() => {}}
          saving={saving}
        />
      )}
    </div>
  );
};

const SidebarButton = ({ label, icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${active ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
  >
    {icon} {label}
  </button>
);

const CoursesPanel = ({ data, onAdd, onEdit, onDelete }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <h3 className="text-xl font-bold">Course Management</h3>
      <button onClick={onAdd} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-green-700 transition">
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
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${course.type === 'Paid' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {course.type}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{course.provider}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{course.duration}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-3">
                  <button onClick={() => onEdit(course)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => onDelete(course._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.courses.length === 0 && (
        <div className="text-center py-20 text-gray-500">No courses yet. Click "Add New Course" to get started.</div>
      )}
    </div>
  </div>
);

const StreamsPanel = ({ data, onDelete, refresh }) => (
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
        {data.map((stream) => (
          <tr key={stream._id} className="hover:bg-gray-50/50 transition">
            <td className="px-6 py-4 font-bold text-gray-900">{stream.name}</td>
            <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{stream.description}</td>
            <td className="px-6 py-4">
              <div className="flex justify-center gap-3">
                <button onClick={() => onDelete(stream._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition">
                  <Trash2 size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100">
      <div>
        <h4 className="font-bold mb-4">Create Stream</h4>
        <StreamForm onCreated={refresh} />
      </div>
      <div>
        <h4 className="font-bold mb-4">Create SubDomain</h4>
        <SubDomainForm streams={data} onCreated={refresh} />
      </div>
    </div>
  </div>
);

const RolesPanel = ({ data, streams, onDelete, refresh }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
      <h3 className="text-xl font-bold">Manage Roles</h3>
    </div>
    <div className="p-6 border-b border-gray-100">
      <h4 className="font-bold mb-4">Create New Role</h4>
      <RoleForm streams={streams} onCreated={refresh} />
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
          {data.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50/50 transition">
              <td className="px-6 py-4 font-bold text-gray-900">{r.title}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{r.subDomain?.name} <span className="text-gray-400">({r.subDomain?.stream?.name})</span></td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {r.skills?.map(s => <span key={s} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">{s}</span>)}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center gap-3">
                  <button onClick={() => onDelete(r._id)} className="text-red-600 hover:bg-red-50 p-2 rounded-full transition">
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
);

const FeedbackPanel = ({ feedback }) => (
  <div className="grid grid-cols-1 gap-6">
    {feedback.map((f) => (
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
    {feedback.length === 0 && (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">No feedback received yet.</div>
    )}
  </div>
);

const CourseModal = ({
  mode,
  formData,
  setFormData,
  subDomains,
  streams,
  roles,
  setShowModal,
  handleSaveCourse,
  handleFormChange,
  handleStreamChange,
  handleSubDomainChange,
  newCourseLink,
  setNewCourseLink,
  newCertLink,
  setNewCertLink,
  newCompany,
  setNewCompany,
  addCompany,
  removeCompany,
  saving
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white">
        <h3 className="text-2xl font-bold">{mode === 'add' ? 'Add New Course' : 'Edit Course'}</h3>
        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-2"><X size={24} /></button>
      </div>

      <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
        <Input label="Course Title *" name="title" value={formData.title} onChange={handleFormChange} required placeholder="e.g., Complete Python Bootcamp" />
        <Input label="Skill *" name="skill" value={formData.skill} onChange={handleFormChange} required placeholder="e.g., Python, Machine Learning" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Stream" name="stream" value={formData.stream} onChange={(e) => handleStreamChange(e.target.value)} options={streams || []} streamsMode />
          <Select label="SubDomain" name="subDomain" value={formData.subDomain} onChange={(e) => handleSubDomainChange(e.target.value)} options={subDomains} disabled={!formData.stream} />
          <Select label="Role" name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} options={roles} disabled={!formData.subDomain} rolesMode />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select label="Type *" name="type" value={formData.type} onChange={handleFormChange} options={[{ _id: 'Free', name: 'Free' }, { _id: 'Paid', name: 'Paid' }]} simple />
          <Input label="Provider *" name="provider" value={formData.provider} onChange={handleFormChange} required placeholder="e.g., Udemy, Coursera" />
        </div>

        {formData.type === 'Paid' && (
          <Input label="Course Amount *" name="amount" type="number" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required placeholder="Enter price" />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Duration" name="duration" value={formData.duration} onChange={handleFormChange} placeholder="e.g., 20 hours, 4 weeks" />
          <Input label="Course Link (primary) *" name="link" value={formData.link} onChange={handleFormChange} required placeholder="https://..." type="url" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceLinksSection formData={formData} setFormData={setFormData} newCourseLink={newCourseLink} setNewCourseLink={setNewCourseLink} />
          <CertificationLinksSection formData={formData} setFormData={setFormData} newCertLink={newCertLink} setNewCertLink={setNewCertLink} />
          <CompaniesSection formData={formData} addCompany={addCompany} removeCompany={removeCompany} newCompany={newCompany} setNewCompany={setNewCompany} />
        </div>

        <Textarea label="Description" name="description" value={formData.description} onChange={handleFormChange} placeholder="Brief description of the course..." />

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 rounded-lg transition shadow-lg flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" size={20} /> : (<><Save size={20} /> Save Course</>)}
          </button>
          <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 border border-gray-300 rounded-lg font-bold hover:bg-gray-50 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);

const ResourceLinksSection = ({ formData, setFormData, newCourseLink, setNewCourseLink }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
    <label className="block text-sm font-bold text-gray-700 mb-2">Course Links (optional)</label>
    <div className="space-y-2 mb-3">
      {formData.resourceLinks.map((c, i) => (
        <div key={i} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
          <div className="flex flex-col">
            <span className="font-semibold">Link {i + 2}: {c.label || c.provider || 'Resource'} • {c.type || 'Free'}{c.type === 'Paid' && c.amount ? ` • ${c.amount}` : ''}</span>
            <span className="text-gray-500 truncate max-w-[240px]">{c.url}</span>
          </div>
          <button type="button" onClick={() => setFormData({ ...formData, resourceLinks: formData.resourceLinks.filter((_, idx) => idx !== i) })} className="text-red-500"><X size={14}/></button>
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <input type="text" placeholder="Label (e.g. Coursera)" className="w-full p-2 border rounded text-sm" value={newCourseLink.label} onChange={(e) => setNewCourseLink({ ...newCourseLink, label: e.target.value })} />
      <input type="url" placeholder="https://course-link" className="w-full p-2 border rounded text-sm" value={newCourseLink.url} onChange={(e) => setNewCourseLink({ ...newCourseLink, url: e.target.value })} />
      <div className="flex gap-2">
        <input type="text" placeholder="Provider" className="flex-1 p-2 border rounded text-sm" value={newCourseLink.provider} onChange={(e) => setNewCourseLink({ ...newCourseLink, provider: e.target.value })} />
        <select className="w-28 p-2 border rounded text-sm" value={newCourseLink.type} onChange={(e) => setNewCourseLink({ ...newCourseLink, type: e.target.value })}>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>
        {newCourseLink.type === 'Paid' && (
          <input type="number" min="0" placeholder="Amount" className="w-24 p-2 border rounded text-sm" value={newCourseLink.amount} onChange={(e) => setNewCourseLink({ ...newCourseLink, amount: e.target.value })} />
        )}
        <button type="button" onClick={() => {
          if (!newCourseLink.url) return;
          if (formData.resourceLinks.length >= 4) return alert('Max 5 links total (primary + 4 extras).');
          if (newCourseLink.type === 'Paid' && (!newCourseLink.amount || Number(newCourseLink.amount) <= 0)) return alert('Enter amount for paid course link');
          setFormData({ ...formData, resourceLinks: [...formData.resourceLinks, newCourseLink] });
          setNewCourseLink({ label: '', url: '', provider: '', type: 'Free', amount: '' });
        }} className="bg-blue-600 text-white px-3 rounded" disabled={formData.resourceLinks.length >= 4}>
          <PlusCircle size={16}/>
        </button>
      </div>
      <p className="text-[11px] text-gray-500">Primary link is required above; add up to 4 extra links (Link 2-5).</p>
    </div>
  </div>
);

const CertificationLinksSection = ({ formData, setFormData, newCertLink, setNewCertLink }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
    <label className="block text-sm font-bold text-gray-700 mb-2">Certification Links (optional)</label>
    <div className="space-y-2 mb-3">
      {formData.certificateLinks.map((c, i) => (
        <div key={i} className="flex items-center justify-between bg-white p-2 rounded border text-xs">
          <div className="flex flex-col">
            <span className="font-semibold">Cert {i + 1}: {c.label || 'Certification'} • {c.type || 'Paid'}{c.type === 'Paid' && c.amount ? ` • ${c.amount}` : ''}</span>
            <span className="text-gray-500 truncate max-w-[240px]">{c.url}</span>
          </div>
          <button type="button" onClick={() => setFormData({ ...formData, certificateLinks: formData.certificateLinks.filter((_, idx) => idx !== i) })} className="text-red-500"><X size={14}/></button>
        </div>
      ))}
    </div>
    <div className="space-y-2">
      <input type="text" placeholder="Certification name" className="w-full p-2 border rounded text-sm" value={newCertLink.label} onChange={(e) => setNewCertLink({ ...newCertLink, label: e.target.value })} />
      <input type="url" placeholder="https://exam-link" className="w-full p-2 border rounded text-sm" value={newCertLink.url} onChange={(e) => setNewCertLink({ ...newCertLink, url: e.target.value })} />
      <div className="flex gap-2 items-center">
        <select className="flex-1 p-2 border rounded text-sm" value={newCertLink.type} onChange={(e) => setNewCertLink({ ...newCertLink, type: e.target.value })}>
          <option value="Free">Free</option>
          <option value="Paid">Paid</option>
        </select>
        {newCertLink.type === 'Paid' && (
          <input type="number" min="0" placeholder="Amount" className="w-24 p-2 border rounded text-sm" value={newCertLink.amount} onChange={(e) => setNewCertLink({ ...newCertLink, amount: e.target.value })} />
        )}
        <button type="button" onClick={() => {
          if (!newCertLink.url && !newCertLink.label) return;
          if (formData.certificateLinks.length >= 5) return alert('Max 5 certification links.');
          if (newCertLink.type === 'Paid' && (!newCertLink.amount || Number(newCertLink.amount) <= 0)) return alert('Enter amount for paid certification');
          setFormData({ ...formData, certificateLinks: [...formData.certificateLinks, newCertLink] });
          setNewCertLink({ label: '', url: '', type: 'Paid', amount: '' });
        }} className="bg-blue-600 text-white px-3 rounded" disabled={formData.certificateLinks.length >= 5}>
          <PlusCircle size={16}/>
        </button>
      </div>
      <p className="text-[11px] text-gray-500">Add up to 5 certification links (optional).</p>
    </div>
  </div>
);

const CompaniesSection = ({ formData, addCompany, removeCompany, newCompany, setNewCompany }) => (
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
      <input type="text" placeholder="e.g. Google, Amazon" className="flex-1 p-2 border rounded text-sm" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
      <button type="button" onClick={addCompany} className="bg-blue-600 text-white px-3 rounded"><PlusCircle size={16}/></button>
    </div>
  </div>
);

const Input = ({ label, name, value, onChange, required = false, placeholder = '', type = 'text', min }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <input type={type} name={name} required={required} value={value} onChange={onChange} min={min} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder={placeholder} />
  </div>
);

const Textarea = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" placeholder={placeholder} />
  </div>
);

const Select = ({ label, name, value, onChange, options, disabled, streamsMode, rolesMode, simple }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <select name={name} value={value} onChange={onChange} disabled={disabled} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
      <option value="">-- Select --</option>
      {options.map((opt) => (
        <option key={opt._id || opt.name} value={opt._id || opt.name}>
          {streamsMode ? opt.name : rolesMode ? opt.title : opt.name || opt.title}
        </option>
      ))}
    </select>
  </div>
);

const StreamForm = ({ onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try { await API.post('/admin/streams', { name, description }); onCreated?.(); setName(''); setDescription(''); } catch { alert('Failed to create stream'); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Stream Name *" name="streamName" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea label="Description *" name="streamDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this stream covers" />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold" disabled={saving}>Create</button>
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
    try { await API.post('/admin/substreams', { name, description, stream }); onCreated?.(); setStream(''); setName(''); setDescription(''); } catch { alert('Failed to create subdomain'); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Select label="Stream *" name="stream" value={stream} onChange={(e) => setStream(e.target.value)} options={streams} />
      <Input label="SubDomain Name *" name="sdName" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea label="Description *" name="sdDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What this subdomain covers" />
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
      try { const { data } = await API.get(`/user/career-path/${stream}`); setSubDomains(data.data.subDomains || []); } catch { setSubDomains([]); }
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
      setStream(''); setSubDomain(''); setSubDomains([]); setTitle(''); setDescription(''); setSkillsText('');
    } catch {
      alert('Failed to create role');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Stream *" name="stream" value={stream} onChange={(e) => setStream(e.target.value)} options={streams} />
        <Select label="SubDomain *" name="subDomain" value={subDomain} onChange={(e) => setSubDomain(e.target.value)} options={subDomains} disabled={!stream} />
      </div>
      <Input label="Role Title *" name="roleTitle" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea label="Description" name="roleDesc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Role summary" />
      <Input label="Skills (comma-separated)" name="skillsText" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="e.g., HTML, CSS, JavaScript" />
      <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg font-bold" disabled={saving}>Create Role</button>
    </form>
  );
};

export default AdminDashboard;