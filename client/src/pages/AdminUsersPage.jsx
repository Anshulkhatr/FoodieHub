import React, { useState, useEffect } from 'react';
import { Users, Trash2, Mail, Shield, Search, Award, Calendar, ChevronRight } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/users');
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this user? This action cannot be undone.')) return;
    
    try {
      await axiosInstance.delete(`/auth/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setMessage({ type: 'success', text: 'User terminated successfully.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete user.' });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Spinner size={48} />
      <p className="text-text-muted text-sm font-bold uppercase tracking-widest animate-pulse">Loading Users…</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <span>👥</span> User Management
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-text-primary mb-4 tracking-tight">
          FoodieHub <span className="text-primary">Community</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Manage all registered users, monitor their points, and maintain community standards.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-bold text-center animate-fade-in ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-12 pr-4 py-3.5 bg-surface border border-border rounded-2xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-4 bg-surface px-6 py-3 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-text-muted">{users.length} Total Users</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background/50 border-b border-border">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">User</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Role</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Loyalty</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Joined</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-background border border-border flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-black text-text-primary mb-0.5">{u.name}</p>
                        <p className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                          <Mail size={12} /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      <Shield size={12} /> {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <Award size={14} className="text-primary" />
                      <span className="text-sm font-black text-text-primary">{u.loyaltyPoints}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-text-muted">
                      <Calendar size={14} />
                      <span className="text-xs font-bold">{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {u.role !== 'admin' ? (
                      <button 
                        onClick={() => deleteUser(u._id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
                        title="Terminate User"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/30 px-3">Protected</span>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <p className="text-text-muted font-black uppercase tracking-widest text-xs">No users found matching your search</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
