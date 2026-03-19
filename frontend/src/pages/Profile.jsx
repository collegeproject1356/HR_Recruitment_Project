import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, User, Activity, ShieldCheck, KeyRound } from 'lucide-react';
import { APPLICATION_API_END_POINT, USER_API_END_POINT } from '../utils/constant';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';

const Profile = () => {
  const { user } = useSelector(store => store.auth);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true });
        if (res.data.success) {
          setAppliedJobs(res.data.application);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'candidate') {
      fetchAppliedJobs();
    }
  }, [user]);

  const resetPasswordHandler = async () => {
    setResetLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/password/forgot`, { email: user.email });
      if (res.data.success) {
        toast.success("Secure password reset link sent to your email!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setResetLoading(false);
    }
  };

  if (user?.role !== 'candidate') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fcf9f6]">
        <h1 className="text-3xl font-serif-garamond text-red-800">Access Denied</h1>
        <p className="text-gray-500 tracking-widest uppercase text-xs mt-4">Candidate Access Only.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f6] min-h-screen flex flex-col pt-28 selection:bg-[var(--dark-green)] selection:text-white">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24 flex-grow w-full">
        
        {/* Top Section: Profile Info & Security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Personal Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="md:col-span-2 bg-white p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-sm flex items-center justify-center text-[var(--dark-green)] flex-shrink-0">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10" />
              )}
            </div>
            <div className="text-center md:text-left">
              <p className="text-[10px] uppercase tracking-widest text-[var(--dark-green)] font-semibold mb-2">Candidate Profile</p>
              <h1 className="text-3xl md:text-4xl font-serif-garamond text-gray-900 mb-3">{user.name}</h1>
              <p className="flex items-center justify-center md:justify-start gap-2 text-gray-500 text-sm font-light tracking-wide">
                <Mail className="w-4 h-4 text-[#d4af37]" /> {user.email}
              </p>
            </div>
          </motion.div>

          {/* Account Security Card (Change Password) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              <h3 className="text-lg font-serif-garamond text-gray-900">Account Security</h3>
            </div>
            <p className="text-xs text-gray-500 font-light leading-relaxed mb-6">
              Update your credentials securely. A reset link will be sent to your registered email address.
            </p>
            <button 
              onClick={resetPasswordHandler}
              disabled={resetLoading}
              className={`flex justify-center items-center gap-2 w-full text-xs font-semibold tracking-widest uppercase py-3 border transition-all duration-300
                ${resetLoading 
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                  : 'bg-transparent text-[var(--dark-green)] border-[var(--dark-green)] hover:bg-[var(--dark-green)] hover:text-white'
                }`}
            >
              <KeyRound className="w-4 h-4" />
              {resetLoading ? 'Sending...' : 'Change Password'}
            </button>
          </motion.div>
        </div>

        {/* Applied Jobs Section (Converted from Table to Cards) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="bg-white p-6 md:p-12 shadow-sm border border-gray-100 rounded-sm"
        >
          <div className="border-b border-gray-100 pb-5 mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif-garamond text-gray-900">Application History</h2>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-2">Track your career progress</p>
            </div>
            <div className="text-[10px] tracking-widest uppercase font-semibold text-gray-400 bg-gray-50 px-3 py-1 border border-gray-100 w-fit">
              Total: {appliedJobs.length}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-4 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : appliedJobs.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-gray-200">
              <p className="text-xs tracking-widest uppercase text-gray-400">You haven't applied to any roles yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {appliedJobs.map((app) => (
                <div key={app._id} className="border border-gray-200 bg-white p-5 hover:border-[var(--dark-green)] transition-colors rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  
                  {/* Role Details */}
                  <div>
                    <h3 className="font-serif-garamond text-xl md:text-2xl text-gray-900 mb-1.5 group-hover:text-[var(--dark-green)] transition-colors">
                      {app.jobId?.title || "Role Unavailable"}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                      {app.jobId?.company?.name || "Confidential Client"}
                    </p>
                  </div>

                  {/* Status & Date */}
                  <div className="flex flex-col sm:items-end gap-3 mt-2 sm:mt-0 border-t border-gray-100 sm:border-0 pt-4 sm:pt-0">
                    <span className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 border flex items-center w-fit gap-2
                      ${app.status === 'Selected' ? 'text-green-700 border-green-200 bg-green-50' : 
                        app.status === 'Rejected' ? 'text-red-700 border-red-200 bg-red-50' : 
                        app.status === 'Interview Scheduled' ? 'text-purple-700 border-purple-200 bg-purple-50' : 
                        'text-[#d4af37] border-[#f1e8d9] bg-[#fcf9f6]'}`}
                    >
                      <Activity className="w-3 h-3" /> {app.status}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
      <Footer />
    </div>
  );
};

export default Profile;