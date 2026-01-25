import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { Briefcase, ArrowLeft, ChevronRight, Loader2, Award } from 'lucide-react';

const SubDomainDetails = () => {
  const { id } = useParams();
  const [subDomain, setSubDomain] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/user/roles/${id}`);
        setRoles(data.data);
        if (data.data.length > 0) {
          setSubDomain(data.data[0].subDomain);
        } else {
          // Fallback: If no roles yet, we might need a separate endpoint for subdomain details
          // but for now we'll just show the header
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-primary mb-2" size={32} />
      <p className="text-gray-500">Loading specialized roles...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{subDomain?.name || 'Career Roles'}</h1>
        <p className="text-xl text-gray-600 max-w-3xl">{subDomain?.description || 'Explore specialized roles within this domain.'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roles.map((role) => (
          <div key={role._id} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="bg-primary/10 p-4 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition">
                <Briefcase size={32} />
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                High Demand
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition">{role.title}</h3>
            <p className="text-gray-600 mb-8 line-clamp-2">{role.description}</p>
            
            <Link
              to={`/role/${role._id}`}
              className="bg-gray-900 text-white w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-primary transition shadow-lg"
            >
              View Detailed Roadmap <ChevronRight size={20} />
            </Link>
          </div>
        ))}
      </div>

      {roles.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No roles found for this subdomain yet.</p>
        </div>
      )}
    </div>
  );
};

export default SubDomainDetails;
