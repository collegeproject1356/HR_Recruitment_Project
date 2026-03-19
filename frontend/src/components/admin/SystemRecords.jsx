import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { USER_API_END_POINT } from '../../utils/constant';

const SystemRecords = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/admin/users`, { withCredentials: true });
      if (res.data.success) setUsers(res.data.users);
    } catch (error) {
      toast.error("Failed to load system records.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to revoke this user's access?")) return;
    try {
      const res = await axios.delete(`${USER_API_END_POINT}/admin/user/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success(res.data.message);
        setUsers(users.filter(user => user._id !== id));
      }
    } catch (error) { toast.error("Failed to delete user."); }
  };

  if (loading) return <div className="p-12 text-center text-gray-500 text-sm tracking-widest uppercase">Accessing secure database...</div>;

  return (
    <div className="bg-white p-6 md:p-8 shadow-sm border border-gray-300 rounded-sm w-full">
      <div className="border-b border-gray-100 pb-5 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-serif-garamond text-gray-900">System Records</h2>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">Manage registered entities</p>
          </div>
          <div className="text-[10px] tracking-widest uppercase font-semibold text-[var(--dark-green)] bg-[#fcf9f6] px-3 py-1 border border-[#e8dcc7]">
            Total Users: {users.length}
          </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u._id} className="border border-gray-300 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between rounded-sm h-full">
            
            <div className="flex justify-between items-start mb-4">
              <div className="overflow-hidden pr-2">
                <h3 className="font-serif-garamond text-lg text-gray-900 leading-tight mb-1 truncate">{u.name}</h3>
                <p className="text-[10px] text-gray-500 tracking-widest truncate">{u.email}</p>
              </div>
              <span className={`text-[8px] uppercase tracking-widest font-bold px-2 py-1 border flex-shrink-0
                ${u.role === 'admin' ? 'text-red-700 border-red-200 bg-red-50' : 
                  u.role === 'hr' ? 'text-[#d4af37] border-[#f1e8d9] bg-[#fcf9f6]' : 
                  'text-[var(--dark-green)] border-gray-200 bg-gray-50'}`}>
                {u.role}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold">
                Joined: {new Date(u.createdAt).toLocaleDateString()}
              </span>
              
              {u.role !== 'admin' ? (
                <button 
                  onClick={() => deleteHandler(u._id)} 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors text-[9px] uppercase tracking-widest font-bold"
                  title="Revoke Access"
                >
                  <Trash2 className="w-3.5 h-3.5"/> Revoke
                </button>
              ) : (
                <span className="text-[9px] text-gray-300 uppercase tracking-widest font-bold">Protected</span>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemRecords;