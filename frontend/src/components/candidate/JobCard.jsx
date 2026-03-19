import { motion } from 'framer-motion';
import { MapPin, ArrowRight, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  const hrInitial = job.postedBy?.name ? job.postedBy.name.charAt(0).toUpperCase() : "C";

  return (
    <Link to={`/description/${job._id}`} className="block h-full">
      <motion.div 
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(26, 74, 46, 0.15)" }} 
        className="bg-white p-6 md:p-8 border border-gray-300 shadow-sm transition-all duration-300 h-full flex flex-col group relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 group-hover:bg-[var(--dark-green)] transition-colors duration-500"></div>

        <div className="flex items-start gap-4 mb-6 mt-2">
          <div className="w-12 h-12 rounded-sm bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-700 font-serif-garamond font-bold text-xl flex-shrink-0 group-hover:bg-[var(--dark-green)] group-hover:text-white transition-colors duration-500">
            {hrInitial}
          </div>
          
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-500 mb-1.5 font-semibold">
              {job.postedBy?.name || "Corporate Role"}
            </p>
            <h3 className="text-xl md:text-2xl font-serif-garamond text-gray-900 group-hover:text-[var(--dark-green)] transition-colors duration-300 line-clamp-2 leading-tight">
              {job.title}
            </h3>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-widest text-gray-600 font-medium mb-8">
          <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 border border-gray-200 group-hover:border-gray-300 transition-colors">
            <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--dark-green)] transition-colors" /> {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 border border-gray-200 group-hover:border-gray-300 transition-colors">
              <IndianRupee className="w-3.5 h-3.5 text-gray-400 group-hover:text-[var(--dark-green)] transition-colors" /> {job.salary}
            </span>
          )}
        </div>

        <div className="mt-auto border-t border-gray-200 pt-5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
          
          <span className="flex items-center text-[11px] uppercase tracking-[0.15em] text-gray-800 group-hover:text-[var(--dark-green)] font-bold transition-colors duration-300">
            View Details <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default JobCard;