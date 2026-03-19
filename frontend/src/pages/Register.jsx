import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { USER_API_END_POINT } from '../utils/constant';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: ""
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(`${USER_API_END_POINT}/google-login`, {
        token: credentialResponse.credential
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/jobs"); 
      }
    } catch (error) {
      toast.error("Google Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcf9f6] pt-24 pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-sm border border-gray-100 p-10 md:p-12"
      >
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 text-[var(--dark-green)]">Join The Elite</p>
          <h2 className="text-3xl md:text-4xl font-serif-garamond text-gray-900 leading-tight">Create Account</h2>
        </div>
        
        <form onSubmit={submitHandler} className="flex flex-col gap-6">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Full Name</label>
            <input type="text" name="name" value={input.name} onChange={changeEventHandler} placeholder="John Doe" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Email Address</label>
            <input type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="name@example.com" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Password</label>
            <input type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="••••••••" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
          </div>

          <button 
            type="submit" 
            className="w-full mt-4 bg-[var(--dark-green)] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 hover:bg-[#11331f] transition-all shadow-lg hover:shadow-xl"
          >
            Sign Up
          </button>
        </form>

        <div className="my-8 flex items-center gap-4">
          <hr className="flex-1 border-gray-200" />
          <span className="text-[10px] uppercase tracking-widest text-gray-400">OR</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <div className="flex justify-center w-full mb-8">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={() => toast.error("Google Signup Failed")} 
          />
        </div>

        <p className="text-center text-[11px] uppercase tracking-widest text-gray-500">
          Already have an account? <Link to="/login" className="text-[var(--dark-green)] font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;