import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, UserCheck, FileText } from 'lucide-react';
import { APPLICATION_API_END_POINT } from '../../utils/constant';

const JobApplicants = ({ jobId, jobTitle, onBack }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });
        if (res.data.success) {
          setApplicants(res.data.applications);
        }
      } catch (error) {
        toast.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.put(`${APPLICATION_API_END_POINT}/status/${id}`, { status }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setApplicants(prev => prev.map(app => app._id === id ? { ...app, status: status } : app));
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20 bg-white border-2 border-gray-200 rounded-sm">
      <div className="w-6 h-6 border-2 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full">
      
      <button onClick={onBack} className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-gray-500 hover:text-[var(--dark-green)] mb-6 w-fit transition-colors font-bold border-b border-transparent hover:border-[var(--dark-green)] pb-1">
        <ArrowLeft className="w-4 h-4" /> Back to Listings
      </button>

      <div className="bg-white p-6 shadow-sm border-2 border-gray-200 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-sm">
        <div>
          <h2 className="text-xl md:text-2xl font-serif-garamond text-gray-900 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[var(--dark-green)]" /> {jobTitle}
          </h2>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2 font-bold">Review Applicants</p>
        </div>
        <div className="text-[10px] tracking-widest uppercase font-bold text-[var(--dark-green)] bg-[#fcf9f6] px-3 py-1 border border-[#e8dcc7]">
          Total: {applicants.length}
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
          <p className="text-xs tracking-widest uppercase text-gray-500 font-bold">No one has applied for this role yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {applicants.map((item) => (
                <div key={item._id} className="bg-white p-5 border-2 border-gray-300 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:border-[var(--dark-green)] transition-all rounded-sm flex flex-col justify-between group block">
                    
                    <div className="flex justify-between items-start mb-4">
                        <div className="pr-2">
                            <h3 className="font-serif-garamond text-xl font-bold text-gray-900 leading-tight group-hover:text-[var(--dark-green)] transition-colors">{item.candidateId?.name}</h3>
                            <p className="text-[10px] text-gray-500 tracking-wider font-bold mt-1">{item.candidateId?.email}</p>
                        </div>
                        <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 border-2 flex-shrink-0
                            ${item.status === 'Selected' ? 'text-green-700 border-green-300 bg-green-50' :
                              item.status === 'Rejected' ? 'text-red-700 border-red-300 bg-red-50' : 
                              item.status === 'Interview Scheduled' ? 'text-purple-700 border-purple-300 bg-purple-50' : 
                              'text-[#b8952d] border-[#d4af37] bg-[#fcf9f6]'}`}
                        >
                            {item.status}
                        </span>
                    </div>

                    <div className="border-t-2 border-gray-100 pt-4 flex flex-wrap justify-between items-center gap-3 mt-auto">
                        <div className="flex items-center gap-4">
                            {item.resumeUrl ? (
                                <a href={item.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[var(--dark-green)] hover:text-black transition-colors">
                                    <FileText className="w-3.5 h-3.5"/> VIEW PDF
                                </a>
                            ) : (
                                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No Resume</span>
                            )}
                        </div>
                        
                        <select 
                            value={item.status} 
                            onChange={(e) => statusHandler(e.target.value, item._id)}
                            className="text-[10px] uppercase tracking-widest font-bold border-2 border-gray-300 px-2 py-1.5 outline-none focus:border-[var(--dark-green)] bg-gray-50 cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Interview Scheduled" className="text-purple-600 font-bold">Interview</option>
                            <option value="Selected" className="text-green-600 font-bold">Select</option>
                            <option value="Rejected" className="text-red-600 font-bold">Reject</option>
                        </select>
                    </div>
                </div>
            ))}
        </div>
      )}
    </motion.div>
  );
};

export default JobApplicants;