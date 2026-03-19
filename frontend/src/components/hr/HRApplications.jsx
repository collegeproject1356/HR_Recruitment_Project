import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { APPLICATION_API_END_POINT } from '../../utils/constant';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';

const HRApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/report/hr`, { withCredentials: true });
                if (res.data.success) {
                    setApplications(res.data.applications);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    const statusHandler = async (status, id) => {
        try {
            const res = await axios.put(`${APPLICATION_API_END_POINT}/status/${id}`, { status }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setApplications(applications.map(app => app._id === id ? { ...app, status } : app));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    if (loading) return (
      <div className="bg-white p-12 shadow-sm border border-gray-100 flex justify-center items-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="bg-white p-6 shadow-sm border-2 border-gray-200 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 rounded-sm">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif-garamond text-gray-900">Applicant Tracking</h2>
                  <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">Manage all received applications</p>
                </div>
                <div className="text-[10px] tracking-widest uppercase font-bold text-[var(--dark-green)] bg-gray-100 px-3 py-1 border border-gray-300">
                  Total: {applications.length}
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-gray-300">
                  <p className="text-xs tracking-widest uppercase text-gray-500 font-bold">No applications received yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white p-5 border-2 border-gray-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] rounded-md flex flex-col justify-between">
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="pr-2">
                                    <h3 className="font-serif-garamond text-xl font-bold text-gray-900 leading-tight">{app.candidateId?.name}</h3>
                                    <p className="text-[10px] text-gray-500 tracking-wider font-bold mt-0.5">{app.candidateId?.email}</p>
                                </div>
                                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 border-2 flex-shrink-0
                                    ${app.status === 'Selected' ? 'text-green-700 border-green-300 bg-green-50' :
                                      app.status === 'Rejected' ? 'text-red-700 border-red-300 bg-red-50' : 
                                      app.status === 'Interview Scheduled' ? 'text-purple-700 border-purple-300 bg-purple-50' : 
                                      'text-[#b8952d] border-[#d4af37] bg-[#fcf9f6]'}`}
                                >
                                    {app.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-[11px] uppercase tracking-widest text-gray-600 font-bold"><span className="text-gray-400">Role:</span> {app.jobId?.title}</p>
                                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-1">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                            </div>

                            <div className="border-t-2 border-gray-200 pt-4 flex justify-between items-center gap-2 mt-auto">
                                {app.resumeUrl ? (
                                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[var(--dark-green)] hover:text-black transition-colors">
                                        <FileText className="w-4 h-4"/> VIEW RESUME
                                    </a>
                                ) : <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">No Resume</span>}
                                
                                <select 
                                    value={app.status}
                                    onChange={(e) => statusHandler(e.target.value, app._id)} 
                                    className="text-[10px] uppercase tracking-widest font-bold border-2 border-gray-300 px-2 py-1.5 outline-none focus:border-[var(--dark-green)] bg-gray-50 cursor-pointer"
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

export default HRApplications;