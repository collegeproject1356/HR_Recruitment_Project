import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { JOB_API_END_POINT } from '../../utils/constant';

const FeaturedJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get`);
        if (res.data.success) {
          setJobs(res.data.jobs.slice(0, 3));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif-garamond text-gray-900 mb-4">Featured Opportunities</h2>
          <div className="w-16 h-[1px] bg-[var(--dark-green)] mx-auto"></div>
        </div>

        {jobs.length === 0 ? (
          <p className="text-center text-gray-500 font-light tracking-wider">Curating exclusive opportunities...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {jobs.map((job, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                key={job._id} 
                className="group border border-gray-200 p-8 hover:border-[var(--dark-green)] transition-colors duration-500 flex flex-col h-full bg-[#fcf9f6]"
              >
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">{job.location}</p>
                  <h3 className="text-2xl font-serif-garamond text-gray-900 group-hover:text-[var(--dark-green)] transition-colors duration-300">
                    {job.title}
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 font-light line-clamp-3 mb-8 flex-grow">
                  {job.description}
                </p>
                
                <Link to="/jobs" className="mt-auto inline-block text-xs font-semibold tracking-widest uppercase text-[var(--dark-green)] hover:text-black transition-colors">
                  Discover More ⟶
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <Link to="/jobs" className="inline-block px-10 py-3 border border-[var(--dark-green)] text-[var(--dark-green)] font-medium text-sm tracking-[0.2em] uppercase hover:bg-[var(--dark-green)] hover:text-white transition-all duration-500">
            View All Vacancies
          </Link>
        </div>

      </div>
    </div>
  );
};

export default FeaturedJobs;