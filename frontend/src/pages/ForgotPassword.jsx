import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { USER_API_END_POINT } from '../utils/constant';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post(`${USER_API_END_POINT}/password/forgot`, { email });
            if (res.data.success) {
                toast.success(res.data.message);
                setEmail("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fcf9f6] pt-20 pb-10">
            <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 p-10 md:p-12">
                <div className="text-center mb-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 text-[var(--dark-green)]">Account Recovery</p>
                    <h2 className="text-3xl font-serif-garamond text-gray-900 leading-tight">Forgot Password?</h2>
                    <p className="text-xs text-gray-500 mt-4 leading-relaxed tracking-wide">Enter your email and we'll send you a secure link to reset your credentials.</p>
                </div>
                
                <form onSubmit={submitHandler} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Registered Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
                    </div>
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className={`w-full mt-4 text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-all duration-300 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--dark-green)] hover:bg-[#11331f] shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link to="/login" className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-[var(--dark-green)] transition-colors">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;