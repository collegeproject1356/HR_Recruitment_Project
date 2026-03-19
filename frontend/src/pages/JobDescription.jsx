import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '../utils/constant';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { MapPin, Briefcase, Wallet, Clock, ArrowLeft, UploadCloud, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const JobDescription = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resume, setResume] = useState(null);
    
    const [myResumeUrl, setMyResumeUrl] = useState(null); 
    
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    const fetchJob = async () => {
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, { withCredentials: true });
            if (res.data.success) {
                setJob(res.data.job);
                
                const myApplication = res.data.job.applications?.find(app => app.candidateId === user?._id);
                if (myApplication) {
                    setIsApplied(true);
                    setMyResumeUrl(myApplication.resumeUrl);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJob();
    }, [id, user?._id]);

    const handleFileChange = (e) => {
        setResume(e.target.files[0]);
    };

    const applyJobHandler = async () => {
        if(!user) {
            toast.error("Please login to apply");
            return navigate("/login");
        }
        if(user.role !== 'candidate'){
            return toast.error("Only candidates can apply.");
        }
        
        if(!resume){
             toast.error("Please select your resume file first.");
             return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("file", resume);

            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true 
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                setResume(null); 
                fetchJob();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to apply");
        } finally {
            setLoading(false);
        }
    };

    if (!job) return <div className="min-h-screen bg-[#fcf9f6] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div></div>;

    return (
        <div className="bg-[#fcf9f6] min-h-screen flex flex-col pt-28 selection:bg-[var(--dark-green)] selection:text-white">
            <Navbar />
            
            <div className="max-w-4xl mx-auto px-6 md:px-12 pb-24 flex-grow w-full">
                
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xs uppercase tracking-widest text-gray-500 hover:text-[var(--dark-green)] transition-colors mb-10">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="border-b border-gray-200 pb-12 mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                        <div>
                            <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[var(--dark-green)] font-semibold mb-4">
                                Role Outline
                            </p>
                            <h1 className="text-4xl md:text-5xl font-serif-garamond text-gray-900 leading-tight mb-6">
                                {job.title}
                            </h1>
                            
                            <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-gray-600 font-medium">
                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#d4af37]" /> {job.location}</span>
                                <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#d4af37]" /> Full Time</span>
                                <span className="flex items-center gap-2"><Wallet className="w-4 h-4 text-[#d4af37]" /> {job.salary || "Competitive"}</span>
                            </div>
                        </div>

                        <div className="flex-shrink-0 flex flex-col gap-5 w-full md:w-auto md:min-w-[280px]">
                            
                            {isApplied ? (
                                <div className="border-b border-gray-300 pb-4 text-center md:text-left">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-3">Your Submitted Document</p>
                                    {myResumeUrl ? (
                                        <a href={myResumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[var(--dark-green)] hover:bg-[var(--dark-green)] hover:text-white transition-all border border-[var(--dark-green)] px-5 py-2.5 w-full md:w-auto">
                                            <FileText className="w-4 h-4" /> VIEW PDF
                                        </a>
                                    ) : (
                                        <span className="text-[10px] uppercase tracking-widest text-gray-400">PDF Unavailable</span>
                                    )}
                                </div>
                            ) : (
                                <div className="border-b border-gray-300 pb-2">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Attach Resume (PDF)</p>
                                    <input 
                                        type="file" 
                                        accept=".pdf,.doc,.docx" 
                                        onChange={handleFileChange}
                                        className="text-xs w-full text-gray-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-wider file:font-semibold file:bg-gray-100 file:text-gray-800 hover:file:bg-[var(--dark-green)] hover:file:text-white transition-all cursor-pointer outline-none" 
                                    />
                                </div>
                            )}

                            <button 
                                onClick={applyJobHandler}
                                disabled={isApplied || loading}
                                className={`px-8 py-4 font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 w-full flex justify-center items-center gap-2
                                    ${isApplied 
                                        ? 'bg-[#fcf9f6] text-[var(--dark-green)] border border-[#e8dcc7] cursor-not-allowed shadow-none' 
                                        : 'bg-[var(--dark-green)] text-white hover:bg-[#11331f] shadow-xl hover:shadow-2xl'
                                    }`}
                            >
                                {loading ? 'Processing...' : isApplied ? 'Application Submitted ✓' : <><UploadCloud className="w-4 h-4"/> Submit Application</>}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-16"
                >
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-serif-garamond text-gray-900 mb-6">About the Role</h3>
                        <p className="text-gray-600 font-light leading-relaxed mb-12 whitespace-pre-wrap">
                            {job.description}
                        </p>

                        <h3 className="text-xl font-serif-garamond text-gray-900 mb-6">Key Requirements</h3>
                        <ul className="list-none space-y-4">
                            {job?.requirements ? job.requirements.split(',').map((req, index) => (
                                <li key={index} className="flex gap-4 text-gray-600 font-light leading-relaxed">
                                    <span className="text-[var(--dark-green)] mt-1">✦</span> {req.trim()}
                                </li>
                            )) : <li className="text-gray-600 font-light">Details not provided.</li>}
                        </ul>
                    </div>

                    <div className="bg-white p-8 border border-gray-100 shadow-sm h-fit">
                        <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-8 text-gray-900 border-b border-gray-100 pb-4">
                            Summary
                        </h4>
                        
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Posted By</p>
                                <p className="text-sm font-medium text-gray-800">{job.postedBy?.name || "HR Department"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Posted On</p>
                                <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-400"/> {new Date(job.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
            <Footer />
        </div>
    );
};

export default JobDescription;