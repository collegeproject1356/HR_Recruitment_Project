import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Download } from 'lucide-react';
import { APPLICATION_API_END_POINT } from '../../utils/constant';

const AdminReports = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminReports = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/report/admin`, { withCredentials: true });
        if (res.data.success) {
          setReportData(res.data.applications);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminReports();
  }, []);

  const downloadPlatformCSV = () => {
    if (reportData.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Job Title,HR Officer,Candidate Name,Candidate Email,Application Status,Apply Date\n";

    reportData.forEach(app => {
      const row = `"${app.jobId?.title || 'Unknown'}","${app.jobId?.postedBy?.name || 'Unknown'}","${app.candidateId?.name}","${app.candidateId?.email}","${app.status}","${new Date(app.createdAt).toLocaleDateString()}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Platform_Hiring_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-12 text-center text-gray-500 text-sm tracking-widest uppercase">Fetching reports data...</div>;

  return (
    <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="bg-gray-50 p-6 rounded-full text-[var(--dark-green)] mb-6 border border-gray-100">
        <BarChart3 className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-serif-garamond text-gray-900 mb-2">Platform Hiring Reports</h2>
      <p className="text-gray-500 max-w-md mb-8 text-sm font-light leading-relaxed">
        Generate and download the master sheet containing all global application activities across the entire portal.
      </p>

      <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-6 border border-gray-100 text-center">
          <p className="text-gray-400 text-[9px] uppercase tracking-widest font-semibold mb-2">Total Volume</p>
          <p className="text-2xl font-serif-garamond text-gray-900">{reportData.length}</p>
        </div>
        <div className="bg-gray-50 p-6 border border-gray-100 text-center">
          <p className="text-gray-400 text-[9px] uppercase tracking-widest font-semibold mb-2">Successful Hires</p>
          <p className="text-2xl font-serif-garamond text-[var(--dark-green)]">{reportData.filter(a => a.status === 'Selected').length}</p>
        </div>
      </div>

      <button 
        onClick={downloadPlatformCSV}
        disabled={reportData.length === 0}
        className="flex items-center gap-3 bg-[var(--dark-green)] text-white px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#11331f] transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none"
      >
        <Download className="w-4 h-4" /> Export CSV
      </button>
    </div>
  );
};

export default AdminReports;