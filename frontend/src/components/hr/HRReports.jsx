import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileSpreadsheet, Download, Users } from 'lucide-react';
import { APPLICATION_API_END_POINT } from '../../utils/constant';

const HRReports = () => {
  const [reportData, setReportData] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API_END_POINT}/report/hr`, { withCredentials: true });
        if (res.data.success) {
          setReportData(res.data.applications);
          setTotalJobs(res.data.totalJobs);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const downloadCSV = () => {
    if (reportData.length === 0) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Candidate Name,Email,Job Title,Location,Status,Applied Date\n";
    reportData.forEach(app => {
      const row = `"${app.candidateId?.name}","${app.candidateId?.email}","${app.jobId?.title}","${app.jobId?.location}","${app.status}","${new Date(app.createdAt).toLocaleDateString()}"`;
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HR_Recruitment_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Generating data...</div>;

  return (
    <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
      <div className="bg-gray-50 p-6 rounded-full text-[var(--dark-green)] mb-6 border border-gray-100">
        <FileSpreadsheet className="w-10 h-10" />
      </div>
      
      <h2 className="text-3xl font-serif-garamond text-gray-900 mb-2">Recruitment Reports</h2>
      <p className="text-gray-500 max-w-md mb-8 text-sm font-light leading-relaxed">
        Download a detailed CSV report of all candidates who applied to your job postings.
      </p>

      <div className="bg-gray-50 w-full max-w-sm p-6 border border-gray-100 mb-8 rounded-sm text-left">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2 text-sm">
          <span className="text-gray-600 font-semibold uppercase tracking-widest text-[10px]">Total Roles:</span>
          <span className="font-serif-garamond text-xl text-gray-800">{totalJobs}</span>
        </div>
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-gray-600 font-semibold uppercase tracking-widest text-[10px] flex items-center gap-1"><Users className="w-3 h-3"/> Total Applications:</span>
          <span className="font-serif-garamond text-xl text-[var(--dark-green)]">{reportData.length}</span>
        </div>
      </div>

      <button 
        onClick={downloadCSV}
        disabled={reportData.length === 0}
        className="flex items-center gap-3 bg-[var(--dark-green)] text-white px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#11331f] transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none"
      >
        <Download className="w-4 h-4" /> Export CSV
      </button>
    </div>
  );
};

export default HRReports;