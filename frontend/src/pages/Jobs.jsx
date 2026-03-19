import { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from '../components/candidate/JobCard';
import { JOB_API_END_POINT } from '../utils/constant';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/home/Footer';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`);
        if (res.data.success) {
          setJobs(res.data.jobs);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#fcf9f6] min-h-screen flex flex-col pt-28 selection:bg-[var(--dark-green)] selection:text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 flex-grow w-full">
        
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-300 pb-6 mb-12 gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 text-[var(--dark-green)]">
              Explore Careers
            </p>
            <h1 className="text-3xl md:text-4xl font-serif-garamond text-gray-900 leading-tight">
              Find Your Dream Role
            </h1>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[var(--dark-green)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search roles or locations..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-8 pr-0 py-2 border-b border-gray-300 bg-transparent text-sm focus:border-[var(--dark-green)] outline-none transition-colors placeholder-gray-500 font-light tracking-wide" 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-8 h-8 border-4 border-[var(--dark-green)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center bg-white p-12 border border-gray-300 shadow-sm">
            <p className="text-sm uppercase tracking-widest text-gray-500 font-medium">No opportunities found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Jobs;