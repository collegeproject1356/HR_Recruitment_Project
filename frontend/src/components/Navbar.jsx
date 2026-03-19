import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserCircle, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';
import { USER_API_END_POINT } from '../utils/constant';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const showPublicLinks = !user || user.role === 'candidate';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        toast.success(res.data.message);
        navigate("/");
        setIsMobileMenuOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  const isSolid = !isHome || isScrolled || isHovered || isMobileMenuOpen;
  const textColorClass = isSolid ? 'text-gray-800' : 'text-white';
  const logoColorClass = isSolid ? 'text-[var(--dark-green)]' : 'text-white';
  const hoverTextColorClass = isSolid ? 'hover:text-[var(--dark-green)]' : 'hover:text-gray-300';
  const logoLink = user?.role === 'hr' ? '/hr/dashboard' : user?.role === 'admin' ? '/admin/dashboard' : '/';

  let brandName = "HIREME";
  if (user?.role === 'admin') brandName = "ADMIN DASHBOARD";
  else if (user?.role === 'hr') brandName = "HR DASHBOARD";

  return (
    <div 
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${isSolid ? 'bg-[#fcf9f6] shadow-sm' : 'bg-transparent'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-[var(--dark-green)] text-white text-[10px] md:text-xs tracking-[0.2em] text-center py-2 px-4 uppercase font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        Unlock Exclusive Career Opportunities
      </div>

      <nav className="border-b border-transparent">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex justify-between items-center relative">
          
          <div className={`hidden md:flex items-center gap-8 text-xs tracking-widest uppercase font-semibold transition-colors duration-300 ${textColorClass} w-1/3`}>
            {showPublicLinks && (
                <>
                  <Link to="/" className={`${hoverTextColorClass} transition-colors`}>Home</Link>
                  <Link to="/jobs" className={`${hoverTextColorClass} transition-colors`}>Careers</Link>
                </>
            )}
          </div>

          <div className="flex justify-center w-auto md:w-1/3">
            <Link to={logoLink} className="z-50">
              <span className={`text-xl md:text-2xl font-serif-garamond font-bold tracking-[0.1em] md:tracking-[0.15em] whitespace-nowrap transition-colors duration-300 ${logoColorClass}`}>
                {brandName}
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-end w-1/3 gap-6 text-xs tracking-widest uppercase font-semibold">
            {!user ? (
              <div className={`flex gap-6 items-center transition-colors duration-300 ${textColorClass}`}>
                <Link to="/login" className={`${hoverTextColorClass} transition-colors`}>Login</Link>
                <Link to="/register" className={`px-5 py-2 rounded-full transition-all border ${isSolid ? 'bg-[var(--dark-green)] text-white border-transparent hover:bg-opacity-90' : 'bg-transparent text-white border-white hover:bg-white hover:text-black'}`}>
                  Join Now
                </Link>
              </div>
            ) : (
              <div className={`flex items-center gap-5 transition-colors duration-300 ${textColorClass}`}>
                <Link to={user.role === 'candidate' ? "/profile" : `/${user.role}/dashboard`} className={`flex items-center gap-2 ${hoverTextColorClass} transition-colors`}>
                  <UserCircle className={`w-5 h-5 ${isSolid ? 'text-[var(--dark-green)]' : 'text-white'}`} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={logoutHandler} className="text-red-500 hover:text-red-700 transition-colors">Logout</button>
              </div>
            )}
          </div>

          <button className="md:hidden z-50 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className={`w-6 h-6 ${isSolid ? 'text-gray-800' : 'text-white'}`} /> : <Menu className={`w-6 h-6 ${isSolid ? 'text-gray-800' : 'text-white'}`} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#fcf9f6] border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col gap-4 text-sm tracking-widest uppercase font-semibold text-gray-800">
            {showPublicLinks && (
                <>
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--dark-green)] py-2 border-b border-gray-100">Home</Link>
                    <Link to="/jobs" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--dark-green)] py-2 border-b border-gray-100">Careers</Link>
                </>
            )}
            
            {user ? (
              <>
                {user.role === 'admin' && location.pathname === '/admin/dashboard' && setActiveTab ? (
                  <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 mb-2">
                    <p className="text-[10px] text-gray-400 mb-2">Admin Options</p>
                    <button onClick={() => {setActiveTab("create-hr"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'create-hr' ? 'text-[var(--dark-green)]' : ''}`}>Manage HRs</button>
                    <button onClick={() => {setActiveTab("approve-jobs"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'approve-jobs' ? 'text-[var(--dark-green)]' : ''}`}>Verify Roles</button>
                    <button onClick={() => {setActiveTab("records"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'records' ? 'text-[var(--dark-green)]' : ''}`}>System Data</button>
                    <button onClick={() => {setActiveTab("reports"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'reports' ? 'text-[var(--dark-green)]' : ''}`}>Hiring Reports</button>
                  </div>
                ) : user.role === 'hr' && location.pathname === '/hr/dashboard' && setActiveTab ? (
                  <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 mb-2">
                    <p className="text-[10px] text-gray-400 mb-2">HR Options</p>
                    <button onClick={() => {setActiveTab("post-job"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'post-job' ? 'text-[var(--dark-green)]' : ''}`}>Post a Role</button>
                    <button onClick={() => {setActiveTab("my-jobs"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'my-jobs' ? 'text-[var(--dark-green)]' : ''}`}>My Listings</button>
                    <button onClick={() => {setActiveTab("applications"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'applications' ? 'text-[var(--dark-green)]' : ''}`}>Applications</button>
                    <button onClick={() => {setActiveTab("reports"); setIsMobileMenuOpen(false);}} className={`text-left py-2 ${activeTab === 'reports' ? 'text-[var(--dark-green)]' : ''}`}>Reports</button>
                  </div>
                ) : (
                  <Link to={user.role === 'candidate' ? "/profile" : `/${user.role}/dashboard`} onClick={() => setIsMobileMenuOpen(false)} className="py-2 border-b border-gray-100 flex items-center gap-2">
                    <UserCircle className="w-5 h-5" /> Dashboard
                  </Link>
                )}
                <button onClick={logoutHandler} className="text-left py-2 text-red-600">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[var(--dark-green)] py-2 border-b border-gray-100">Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="py-2 text-[var(--dark-green)]">Join Now</Link>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;