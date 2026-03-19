import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { JOB_API_END_POINT } from '../../utils/constant';

const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Role posted successfully. Pending admin approval.");
        setInput({ title: "", description: "", requirements: "", salary: "", location: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 md:p-12 shadow-sm border border-gray-100"
    >
      <div className="border-b border-gray-100 pb-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-serif-garamond text-gray-900">Post a New Role</h2>
        <p className="text-xs text-gray-500 tracking-widest uppercase mt-2">Create a new opportunity</p>
      </div>
      
      <form onSubmit={submitHandler} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Job Title</label>
            <input type="text" name="title" value={input.title} onChange={changeEventHandler} placeholder="e.g., Senior Analyst" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Location</label>
            <input type="text" name="location" value={input.location} onChange={changeEventHandler} placeholder="e.g., London, UK" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Description</label>
          <textarea name="description" value={input.description} onChange={changeEventHandler} placeholder="Detailed role description..." rows="4" className="w-full px-4 py-3 border border-gray-200 focus:border-[var(--dark-green)] bg-gray-50 outline-none text-sm transition-colors resize-none" required />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Requirements <span className="text-gray-400 font-light tracking-normal lowercase">(comma separated)</span></label>
          <input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} placeholder="e.g., Leadership, Python, 5+ years experience" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Compensation (Optional)</label>
          <input type="text" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="e.g., Competitive" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" />
        </div>

        <button 
          disabled={loading}
          type="submit" 
          className={`w-full mt-6 text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-all duration-300 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--dark-green)] hover:bg-[#11331f] shadow-lg hover:shadow-xl'}`}
        >
          {loading ? 'Processing...' : 'Submit Listing'}
        </button>
      </form>
    </motion.div>
  );
};

export default PostJob;