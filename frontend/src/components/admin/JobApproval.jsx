import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Check, X, Eye, MapPin, IndianRupee, Briefcase, FileText } from 'lucide-react';
import { JOB_API_END_POINT } from '../../utils/constant';
import { motion, AnimatePresence } from 'framer-motion';

const JobApproval = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchPendingJobs = async () => {
    try {
      const res = await axios.get(`${JOB_API_END_POINT}/admin/pending`, { withCredentials: true });
      if (res.data.success) setJobs(res.data.jobs);
    } catch (error) {
      toast.error("Failed to fetch pending jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      const res = await axios.put(`${JOB_API_END_POINT}/status/${jobId}`, { status: newStatus }, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setJobs(jobs.filter(job => job._id !== jobId));
        
        if (selectedJob && selectedJob._id === jobId) {
            setSelectedJob(null);
        }
      }
    } catch (error) { 
      toast.error("Status update failed"); 
    }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 text-sm tracking-widest uppercase">Retrieving pending roles...</div>;

  return (
    <div className="bg-white p-6 md:p-10 shadow-sm border border-gray-300 w-full rounded-sm">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-2xl md:text-3xl font-serif-garamond text-gray-900">Pending Approvals</h2>
        <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">Verify new role requests</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-200">
          <p className="text-xs tracking-widest uppercase text-gray-400">All caught up. No pending requests.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <div key={job._id} className="border border-gray-300 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-5 hover:border-[var(--dark-green)] transition-colors shadow-sm">
              
              <div>
                <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-1.5 font-bold">
                  By {job.postedBy?.name}
                </p>
                <h3 className="text-xl font-serif-garamond text-gray-900 mb-2 leading-tight">{job.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-[9px] uppercase tracking-widest text-gray-500 font-bold">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200"><MapPin className="w-3 h-3 text-[var(--dark-green)]"/> {job.location}</span>
                  {job.salary && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200"><IndianRupee className="w-3 h-3 text-[var(--dark-green)]"/> {job.salary}</span>}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button 
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>

                <button 
                  onClick={() => handleStatusUpdate(job._id, 'approved')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-[var(--dark-green)] text-[var(--dark-green)] px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-[var(--dark-green)] hover:text-white transition-colors"
                >
                  <Check className="w-3.5 h-3.5" /> Approve
                </button>
                <button 
                  onClick={() => handleStatusUpdate(job._id, 'rejected')}
                  className="flex-1 md:flex-none flex items-center justify-center gap-1.5 border border-red-600 text-red-600 px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#fcf9f6] w-full max-w-2xl rounded-sm shadow-2xl border border-[#e8dcc7] overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="bg-white px-6 py-5 border-b border-gray-200 flex justify-between items-start sticky top-0 z-10">
                <div>
                  <p className="text-[9px] uppercase tracking-widest text-[var(--dark-green)] font-bold mb-1">Role Verification</p>
                  <h2 className="text-2xl font-serif-garamond text-gray-900 leading-tight">{selectedJob.title}</h2>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1.5 font-semibold">
                    Posted By: <span className="text-gray-800">{selectedJob.postedBy?.name}</span> ({selectedJob.postedBy?.email})
                  </p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 bg-white">
                <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest text-gray-600 font-bold border-b border-gray-100 pb-6">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[var(--dark-green)]" /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-[var(--dark-green)]" /> Full Time</span>
                  {selectedJob.salary && <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4 text-[var(--dark-green)]" /> {selectedJob.salary}</span>}
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5"/> Role Description
                  </h3>
                  <p className="text-sm text-gray-700 font-light leading-relaxed whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-3">Key Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.split(',').map((req, index) => (
                      <li key={index} className="flex gap-3 text-sm text-gray-700 font-light">
                        <span className="text-[var(--dark-green)] text-xs mt-0.5">✦</span> {req.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-wrap justify-end gap-3 sticky bottom-0 z-10">
               
              
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobApproval;