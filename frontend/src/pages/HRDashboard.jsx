import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Briefcase, FilePlus, Users, FileSpreadsheet } from 'lucide-react';
import PostJob from '../components/hr/PostJob';
import MyJobs from '../components/hr/MyJobs';
import HRReports from '../components/hr/HRReports';
import HRApplications from '../components/hr/HRApplications';
import Navbar from '../components/Navbar';

const HRDashboard = () => {
  const { user } = useSelector(store => store.auth);
  const [activeTab, setActiveTab] = useState("post-job");

  if (user?.role !== 'hr') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#fcf9f6]">
        <h1 className="text-3xl font-serif-garamond text-red-800">Access Denied</h1>
        <p className="text-gray-500 tracking-widest uppercase text-xs mt-4">Authorized Personnel Only.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f6] min-h-screen selection:bg-[var(--dark-green)] selection:text-white pt-24 pb-24 md:pb-12 flex flex-col">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-8 flex flex-col md:flex-row gap-8 flex-grow w-full">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 sticky top-28">
            <h2 className="text-[10px] tracking-[0.2em] uppercase font-semibold text-gray-400 mb-8 border-b border-gray-100 pb-4">HR Controls</h2>
            <div className="flex flex-col gap-2">
              <button onClick={() => setActiveTab("post-job")} className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-medium transition-all w-full text-left ${activeTab === 'post-job' ? 'text-[var(--dark-green)] border-l-2 border-[var(--dark-green)] bg-gray-50' : 'text-gray-500 hover:text-gray-800 border-l-2 border-transparent'}`}><FilePlus className="w-4 h-4" /> Post a Role</button>
              <button onClick={() => setActiveTab("my-jobs")} className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-medium transition-all w-full text-left ${activeTab === 'my-jobs' ? 'text-[var(--dark-green)] border-l-2 border-[var(--dark-green)] bg-gray-50' : 'text-gray-500 hover:text-gray-800 border-l-2 border-transparent'}`}><Briefcase className="w-4 h-4" /> My Listings</button>
              <button onClick={() => setActiveTab("applications")} className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-medium transition-all w-full text-left ${activeTab === 'applications' ? 'text-[var(--dark-green)] border-l-2 border-[var(--dark-green)] bg-gray-50' : 'text-gray-500 hover:text-gray-800 border-l-2 border-transparent'}`}><Users className="w-4 h-4" /> Applications</button>
              <button onClick={() => setActiveTab("reports")} className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-medium transition-all w-full text-left ${activeTab === 'reports' ? 'text-[var(--dark-green)] border-l-2 border-[var(--dark-green)] bg-gray-50' : 'text-gray-500 hover:text-gray-800 border-l-2 border-transparent'}`}><FileSpreadsheet className="w-4 h-4" /> Reports</button>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full overflow-hidden">
          {activeTab === "post-job" && <PostJob />}
          {activeTab === "my-jobs" && <MyJobs />}
          {activeTab === "applications" && <HRApplications />}
          {activeTab === "reports" && <HRReports />}
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 flex justify-around items-center py-2 px-1">
        <button onClick={() => setActiveTab("post-job")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'post-job' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <FilePlus className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1">Post</span>
        </button>
        <button onClick={() => setActiveTab("my-jobs")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'my-jobs' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Briefcase className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1">Listings</span>
        </button>
        <button onClick={() => setActiveTab("applications")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'applications' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Users className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1">Apps</span>
        </button>
        <button onClick={() => setActiveTab("reports")} className={`flex flex-col items-center gap-1 p-2 w-1/4 transition-colors ${activeTab === 'reports' ? 'text-[var(--dark-green)]' : 'text-gray-400 hover:text-gray-600'}`}>
          <FileSpreadsheet className="w-5 h-5" />
          <span className="text-[9px] uppercase tracking-widest font-semibold mt-1">Reports</span>
        </button>
      </div>

    </div>
  );
};

export default HRDashboard;