import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { JOB_API_END_POINT } from '../../utils/constant';
import { Edit2, Trash2, MapPin, IndianRupee, X, Check, Briefcase, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import JobApplicants from './JobApplicants';

const MyJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [viewingApplicantsJob, setViewingApplicantsJob] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJobId, setEditingJobId] = useState(null);
    const [editForm, setEditForm] = useState({ 
        title: "", location: "", salary: "", requirements: "", description: "" 
    });

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/hr/my-jobs`, { withCredentials: true });
                if (res.data.success) setJobs(res.data.jobs);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyJobs();
    }, []);

    const deleteJobHandler = async (id) => {
        if(!window.confirm("Are you sure you want to delete this job posting?")) return;
        try {
            const res = await axios.delete(`${JOB_API_END_POINT}/delete/${id}`, { withCredentials: true });
            if(res.data.success){
                toast.success(res.data.message);
                setJobs(jobs.filter(job => job._id !== id));
            }
        } catch (error) { toast.error(error.response?.data?.message || "Failed to delete job"); }
    };

    const handleEditClick = (job) => {
        setEditingJobId(job._id);
        setEditForm({ title: job.title, location: job.location, salary: job.salary || "", requirements: job.requirements || "", description: job.description });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingJobId(null);
    };

    const updateJobHandler = async (e) => {
        e.preventDefault(); 
        try {
            const res = await axios.put(`${JOB_API_END_POINT}/update/${editingJobId}`, editForm, { withCredentials: true });
            if (res.data.success) {
                toast.success("Listing updated successfully");
                setJobs(jobs.map(job => job._id === editingJobId ? { ...job, ...editForm } : job));
                closeModal();
            }
        } catch (error) { toast.error(error.response?.data?.message || "Failed to update job"); }
    };

    if (viewingApplicantsJob) {
        return (
            <JobApplicants 
                jobId={viewingApplicantsJob._id} 
                jobTitle={viewingApplicantsJob.title}
                onBack={() => setViewingApplicantsJob(null)} 
            />
        );
    }

    if (loading) return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 flex justify-center items-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="bg-white p-6 shadow-sm border-2 border-gray-200 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-sm">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif-garamond text-gray-900">My Posted Roles</h2>
                  <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">Manage your listings</p>
                </div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[var(--dark-green)] bg-[#fcf9f6] px-3 py-1 border border-[#e8dcc7]">
                  Total: {jobs.length}
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
                  <p className="text-xs tracking-widest uppercase text-gray-500 font-bold">No active listings found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white p-5 border-2 border-gray-300 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:border-[var(--dark-green)] transition-all rounded-sm flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-serif-garamond text-xl font-bold text-gray-900 leading-tight pr-4 group-hover:text-[var(--dark-green)] transition-colors">{job.title}</h3>
                                    
                                    <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 border-2 flex-shrink-0
                                        ${job.status === 'approved' ? 'text-green-700 border-green-300 bg-green-50' :
                                          job.status === 'rejected' ? 'text-red-700 border-red-300 bg-red-50' : 
                                          job.status === 'interview' ? 'text-purple-700 border-purple-300 bg-purple-50' : 
                                          'text-[#b8952d] border-[#d4af37] bg-[#fcf9f6]'}`}
                                    >
                                        {job.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-gray-600 font-bold mb-4 mt-3">
                                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200"><MapPin className="w-3 h-3 text-[var(--dark-green)]" /> {job.location}</span>
                                    {job.salary && <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 border border-gray-200"><IndianRupee className="w-3 h-3 text-[var(--dark-green)]" /> {job.salary}</span>}
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-100 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                    {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                                
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    <button 
                                        onClick={() => setViewingApplicantsJob(job)} 
                                        className="bg-gray-100 border-2 border-gray-200 text-gray-800 px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold hover:border-[var(--dark-green)] hover:text-[var(--dark-green)] hover:bg-white transition-all w-full sm:w-auto text-center flex items-center justify-center gap-1.5"
                                    >
                                        <Users className="w-3.5 h-3.5"/> Applicants
                                    </button>

                                    <button onClick={() => handleEditClick(job)} className="text-gray-500 hover:text-[var(--dark-green)] hover:bg-gray-100 p-1.5 border-2 border-transparent hover:border-gray-200 transition-all" title="Edit Role">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => deleteJobHandler(job._id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 border-2 border-transparent hover:border-red-100 transition-all" title="Delete Role">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#fcf9f6] w-full max-w-2xl rounded-sm shadow-2xl border border-[#e8dcc7] overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 z-10">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-[var(--dark-green)]" />
                                    <h2 className="text-xl font-serif-garamond font-bold text-gray-900">Update Listing</h2>
                                </div>
                                <button onClick={closeModal} className="text-gray-400 hover:text-red-600 transition-colors p-1"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form id="editJobForm" onSubmit={updateJobHandler} className="flex flex-col gap-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Job Title</label><input type="text" value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} className="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:border-[var(--dark-green)] outline-none transition-colors" required /></div>
                                        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Location</label><input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:border-[var(--dark-green)] outline-none transition-colors" required /></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Salary (Optional)</label><input type="text" value={editForm.salary} onChange={(e) => setEditForm({...editForm, salary: e.target.value})} className="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:border-[var(--dark-green)] outline-none transition-colors" placeholder="e.g. 12 LPA" /></div>
                                        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Requirements (Comma separated)</label><input type="text" value={editForm.requirements} onChange={(e) => setEditForm({...editForm, requirements: e.target.value})} className="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:border-[var(--dark-green)] outline-none transition-colors" required /></div>
                                    </div>
                                    <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Detailed Description</label><textarea value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} rows="5" className="w-full bg-white border border-gray-300 px-3 py-2 text-sm focus:border-[var(--dark-green)] outline-none transition-colors resize-none" required></textarea></div>
                                </form>
                            </div>

                            <div className="bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 z-10">
                                <button onClick={closeModal} type="button" className="px-5 py-2.5 text-[10px] uppercase tracking-widest font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                                <button type="submit" form="editJobForm" className="px-6 py-2.5 text-[10px] uppercase tracking-widest font-bold text-white bg-[var(--dark-green)] hover:bg-[#11331f] transition-colors flex items-center gap-1.5 shadow-md"><Check className="w-3.5 h-3.5" /> Save Changes</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyJobs;