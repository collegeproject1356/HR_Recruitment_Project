import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ShieldCheck, UserPlus, ListChecks, Activity, Users, Briefcase, FileText, Database, BarChart3 } from 'lucide-react';
import JobApproval from '../components/admin/JobApproval';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { USER_API_END_POINT } from '../utils/constant';
import SystemRecords from '../components/admin/SystemRecords';
import AdminReports from '../components/admin/AdminReports';
import Navbar from '../components/Navbar';

const CreateHRForm = () => {
  const [input, setInput] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${USER_API_END_POINT}/admin/create-hr`, input, { headers: { "Content-Type": "application/json" }, withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ name: "", email: "", password: "" });
      }
    } catch (error) { toast.error(error.response?.data?.message || "Failed to create HR account"); } 
    finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-10 shadow-sm border border-gray-300 w-full rounded-sm">
      <div className="border-b border-gray-100 pb-5 mb-6">
        <h2 className="text-2xl font-serif-garamond text-gray-900">Onboard HR Executive</h2>
        <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">Create a new recruiter profile</p>
      </div>
      <form onSubmit={submitHandler} className="flex flex-col gap-5 w-full max-w-lg">
        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-semibold">Full Name</label><input type="text" name="name" value={input.name} onChange={changeEventHandler} className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required /></div>
        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-semibold">Official Email</label><input type="email" name="email" value={input.email} onChange={changeEventHandler} className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required /></div>
        <div><label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1 font-semibold">Temporary Password</label><input type="password" name="password" value={input.password} onChange={changeEventHandler} className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required /></div>
        <button disabled={loading} type="submit" className={`w-full mt-3 text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 transition-all duration-300 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--dark-green)] hover:bg-[#11331f] shadow-md hover:shadow-lg'}`}>{loading ? 'Processing...' : 'Authorize Account'}</button>
      </form>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState("create-hr");
  const [stats, setStats] = useState({ totalCandidates: 0, totalHRs: 0, totalJobs: 0, totalApplications: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/admin/stats`, { withCredentials: true });
        if (res.data.success) setStats(res.data.stats);
      } catch (error) {}
    };
    if (user?.role === 'admin') fetchStats();
  }, [user, activeTab]);

  if (user?.role !== 'admin') return <div className="flex flex-col items-center justify-center h-screen bg-[#fcf9f6]"><h1 className="text-3xl font-serif-garamond text-red-800">Access Denied</h1></div>;

  return (
    <div className="bg-[#fcf9f6] min-h-screen flex flex-col pt-24 pb-24 md:pb-12 selection:bg-[var(--dark-green)] selection:text-white">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-6 flex-grow w-full flex flex-col md:flex-row gap-6">
        <div className="hidden md:block w-60 flex-shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-300 p-5 sticky top-28">
            <h2 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-400 mb-6 border-b border-gray-100 pb-3">Master Controls</h2>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setActiveTab("create-hr")} className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-semibold transition-all w-full text-left ${activeTab === 'create-hr' ? 'text-[var(--dark-green)] bg-[#fcf9f6] border border-[#e8dcc7]' : 'text-gray-500 hover:text-gray-800 border border-transparent'}`}><UserPlus className="w-4 h-4" /> Manage HRs</button>
              <button onClick={() => setActiveTab("approve-jobs")} className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-semibold transition-all w-full text-left ${activeTab === 'approve-jobs' ? 'text-[var(--dark-green)] bg-[#fcf9f6] border border-[#e8dcc7]' : 'text-gray-500 hover:text-gray-800 border border-transparent'}`}><ListChecks className="w-4 h-4" /> Verify Roles</button>
              <button onClick={() => setActiveTab("records")} className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-semibold transition-all w-full text-left ${activeTab === 'records' ? 'text-[var(--dark-green)] bg-[#fcf9f6] border border-[#e8dcc7]' : 'text-gray-500 hover:text-gray-800 border border-transparent'}`}><Database className="w-4 h-4" /> System Data</button>
              <button onClick={() => setActiveTab("reports")} className={`flex items-center gap-3 px-3 py-2.5 text-[11px] tracking-widest uppercase font-semibold transition-all w-full text-left ${activeTab === 'reports' ? 'text-[var(--dark-green)] bg-[#fcf9f6] border border-[#e8dcc7]' : 'text-gray-500 hover:text-gray-800 border border-transparent'}`}><BarChart3 className="w-4 h-4" /> Hiring Reports</button> 
            </div>
          </div>
        </div>

        <div className="flex-1 w-full overflow-hidden flex flex-col gap-6">
          {activeTab !== "approve-jobs" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-gray-300 p-4 shadow-sm flex items-center justify-between rounded-sm"><div><p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Candidates</p><h4 className="text-xl md:text-2xl font-serif-garamond text-gray-900 leading-none">{stats.totalCandidates}</h4></div><Users className="w-6 h-6 text-gray-200"/></div>
              <div className="bg-white border border-gray-300 p-4 shadow-sm flex items-center justify-between rounded-sm"><div><p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Executives</p><h4 className="text-xl md:text-2xl font-serif-garamond text-gray-900 leading-none">{stats.totalHRs}</h4></div><ShieldCheck className="w-6 h-6 text-gray-200"/></div>
              <div className="bg-white border border-gray-300 p-4 shadow-sm flex items-center justify-between rounded-sm"><div><p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Active Roles</p><h4 className="text-xl md:text-2xl font-serif-garamond text-gray-900 leading-none">{stats.totalJobs}</h4></div><Briefcase className="w-6 h-6 text-gray-200"/></div>
              <div className="bg-white border border-gray-300 p-4 shadow-sm flex items-center justify-between rounded-sm"><div><p className="text-[9px] uppercase tracking-widest text-gray-500 font-semibold mb-1">Applications</p><h4 className="text-xl md:text-2xl font-serif-garamond text-gray-900 leading-none">{stats.totalApplications}</h4></div><FileText className="w-6 h-6 text-gray-200"/></div>
            </motion.div>
          )}
          <div className="h-full w-full overflow-hidden">
            {activeTab === "create-hr" && <CreateHRForm />}
            {activeTab === "approve-jobs" && <JobApproval />}
            {activeTab === "records" && <SystemRecords />}
            {activeTab === "reports" && <AdminReports />}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center py-2 px-1">
        <button onClick={() => setActiveTab("create-hr")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'create-hr' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <UserPlus className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1 text-center leading-tight">HRs</span>
        </button>
        <button onClick={() => setActiveTab("approve-jobs")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'approve-jobs' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <ListChecks className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1 text-center leading-tight">Verify</span>
        </button>
        <button onClick={() => setActiveTab("records")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'records' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Database className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1 text-center leading-tight">Records</span>
        </button>
        <button onClick={() => setActiveTab("reports")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'reports' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <BarChart3 className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1 text-center leading-tight">Reports</span>
        </button>
      </div>

    </div>
  );
};

export default AdminDashboard;