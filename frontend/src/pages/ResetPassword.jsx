import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { USER_API_END_POINT } from '../utils/constant';

const ResetPassword = () => {
    const [passwords, setPasswords] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.put(`${USER_API_END_POINT}/password/reset/${token}`, passwords);
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#fcf9f6] pt-20 pb-10">
            <div className="w-full max-w-md bg-white shadow-sm border border-gray-100 p-10 md:p-12">
                <div className="text-center mb-10">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 text-[var(--dark-green)]">Account Security</p>
                    <h2 className="text-3xl font-serif-garamond text-gray-900 leading-tight">New Password</h2>
                </div>
                
                <form onSubmit={submitHandler} className="flex flex-col gap-6">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">New Password</label>
                        <input type="password" name="password" value={passwords.password} onChange={changeEventHandler} placeholder="••••••••" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-semibold">Confirm New Password</label>
                        <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={changeEventHandler} placeholder="••••••••" className="w-full px-0 py-2 border-b border-gray-300 focus:border-[var(--dark-green)] bg-transparent outline-none text-sm transition-colors" required />
                    </div>
                    <button 
                        disabled={loading} 
                        type="submit" 
                        className={`w-full mt-4 text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 transition-all duration-300 ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[var(--dark-green)] hover:bg-[#11331f] shadow-lg hover:shadow-xl'}`}
                    >
                        {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword;