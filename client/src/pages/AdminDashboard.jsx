import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';

const AdminDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [revenue, setRevenue] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get('/admin/revenue');
        setRevenue(data.totalRevenue || 0);
        setOrderCount(data.totalOrders || 0);
      } catch (error) {
        console.error('Failed to fetch revenue stats', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-3xl font-heading font-bold text-text-primary">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/admin/revenue" className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center h-40 hover:border-primary transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">VIEW DETAILS</span>
          </div>
          <h3 className="text-lg text-text-muted mb-2">Total Revenue</h3>
          <p className="text-4xl font-heading font-bold text-success">₹{revenue.toFixed(2)}</p>
        </Link>
        <div className="bg-surface p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center h-40">
          <h3 className="text-lg text-text-muted mb-2">Delivered Orders</h3>
          <p className="text-4xl font-heading font-bold text-primary">{orderCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link to="/admin/menu" className="block p-6 bg-surface border border-border rounded-xl shadow-sm hover:border-primary transition-colors group">
          <h2 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">Manage Menu</h2>
          <p className="text-text-muted mt-2">Add, edit, or remove items from the restaurant menu. Includes AI generation tools.</p>
        </Link>
        <Link to="/admin/orders" className="block p-6 bg-surface border border-border rounded-xl shadow-sm hover:border-primary transition-colors group">
          <h2 className="text-xl font-bold font-heading group-hover:text-primary transition-colors">Manage Orders</h2>
          <p className="text-text-muted mt-2">View active orders and update their statuses (Pending, Preparing, Ready, Delivered).</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
