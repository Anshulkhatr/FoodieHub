import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Award, Edit3, Save, X, Trash2 } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axiosInstance.get('/auth/profile');
      setUser(data);
      setFormData({ name: data.name, email: data.email, password: '' });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axiosInstance.put('/auth/profile', formData);
      setUser(data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Update local storage if needed
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      localStorage.setItem('userInfo', JSON.stringify({ ...userInfo, ...data }));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (isLoading && !user) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Spinner size={48} />
      <p className="text-text-muted text-sm font-bold uppercase tracking-widest animate-pulse">Loading Profile…</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <span>👤</span> Your Identity
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-black text-text-primary mb-4 tracking-tight">
          Personal <span className="text-primary">Profile</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Manage your account details and view your status in the FoodieHub community.
        </p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-2xl text-sm font-bold text-center animate-fade-in ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-[2.5rem] p-8 text-center shadow-sm">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-md">
              <User size={40} className="text-primary" />
            </div>
            <h2 className="text-xl font-heading font-black text-text-primary mb-1">{user?.name}</h2>
            <p className="text-xs text-text-muted font-bold uppercase tracking-widest mb-4">{user?.role}</p>
            
            <div className="flex items-center justify-center gap-2 bg-background/50 py-2 px-4 rounded-xl border border-border/50">
              <Award size={16} className="text-primary" />
              <span className="text-sm font-black text-text-primary">{user?.loyaltyPoints} Points</span>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-muted">Vouchers</span>
                <span className="text-sm font-black text-text-primary">{user?.vouchers?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-text-muted">Member Since</span>
                <span className="text-sm font-black text-text-primary">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-black text-text-primary">Account Details</h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-primary hover:bg-primary/5 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-primary/20"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-2xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-2xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-text-muted ml-1">New Password (leave blank to keep current)</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-2xl outline-none text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isLoading ? <Spinner size={16} color="white" /> : <><Save size={16} /> Save Changes</>}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setFormData({ name: user.name, email: user.email, password: '' }); }}
                    className="px-6 py-4 bg-surface border border-border rounded-2xl font-black text-xs uppercase tracking-widest text-text-muted hover:text-text-primary transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-sm">
                    <User size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Full Name</p>
                    <p className="text-base font-bold text-text-primary">{user?.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-sm">
                    <Mail size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Email Address</p>
                    <p className="text-base font-bold text-text-primary">{user?.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-background/50 rounded-2xl border border-border/50">
                  <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-border shadow-sm">
                    <Shield size={20} className="text-text-muted" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Account Role</p>
                    <p className="text-base font-bold text-text-primary capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
