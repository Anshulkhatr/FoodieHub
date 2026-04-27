import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, TrendingUp, ChevronRight, Activity, Users } from 'lucide-react';

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
        const { data } = await axiosInstance.get('/admin/revenue?period=all');
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

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  const cards = [
    { title: 'Total Revenue', value: `₹${revenue.toFixed(2)}`, label: 'All Time', icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', link: '/admin/revenue' },
    { title: 'Total Orders', value: orderCount, label: 'Successfully Delivered', icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10', link: '/admin/orders' },
  ];

  return (
    <div className="py-8 space-y-10 animate-fade-in-up">
      {/* Header section with decorative element */}
      <div className="relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <LayoutDashboard size={24} />
          </div>
          <span className="text-sm font-bold text-primary uppercase tracking-widest">Admin Control</span>
        </div>
        <h1 className="text-4xl font-heading font-extrabold text-text-primary">Executive Dashboard</h1>
        <p className="text-text-muted mt-2 max-w-2xl">Overview of your restaurant's performance and management tools. Track growth and manage operations seamlessly.</p>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card, i) => (
          <Link 
            key={i}
            to={card.link} 
            className="group bg-surface p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted mb-1">{card.title}</p>
                <h3 className={`text-4xl font-heading font-bold ${card.color}`}>{card.value}</h3>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted font-medium bg-background px-2 py-1 rounded-full w-fit border border-border/50">
                  <Activity size={12} className="text-primary" />
                  {card.label}
                </div>
              </div>
              <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <card.icon className={card.color} size={28} />
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
              VIEW DETAILED REPORT <ChevronRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {/* Action Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Link 
          to="/admin/menu" 
          className="group relative block p-8 bg-surface border border-border rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <Utensils size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-heading text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
              Manage Menu
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-text-muted mt-3 text-sm leading-relaxed max-w-md">
              Catalog your culinary offerings. Add new dishes, adjust pricing, and use AI to generate gourmet descriptions that captivate customers.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded-md font-bold uppercase tracking-tighter">AI Enabled</span>
              <span className="text-[10px] bg-background text-text-muted px-2 py-1 rounded-md font-bold uppercase tracking-tighter border border-border">Menu Editor</span>
            </div>
          </div>
        </Link>

        <Link 
          to="/admin/orders" 
          className="group relative block p-8 bg-surface border border-border rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors">
            <ShoppingBag size={120} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-heading text-text-primary group-hover:text-primary transition-colors flex items-center gap-2">
              Manage Orders
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </h2>
            <p className="text-text-muted mt-3 text-sm leading-relaxed max-w-md">
              Orchestrate your kitchen flow. Real-time order tracking from preparation to final delivery. Keep customers updated every step of the way.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="text-[10px] bg-success/10 text-success px-2 py-1 rounded-md font-bold uppercase tracking-tighter">Live Traffic</span>
              <span className="text-[10px] bg-background text-text-muted px-2 py-1 rounded-md font-bold uppercase tracking-tighter border border-border">Order Fulfilment</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        <Link 
          to="/admin/users" 
          className="group relative block p-6 bg-surface border border-border rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Users size={24} />
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 group-hover:text-primary transition-all" />
          </div>
          <h3 className="text-xl font-bold font-heading text-text-primary group-hover:text-primary transition-colors">Manage Users</h3>
          <p className="text-text-muted mt-2 text-xs leading-relaxed">
            Oversee the FoodieHub community. Monitor loyalty points, view profiles, and manage account access.
          </p>
        </Link>

        <Link 
          to="/admin/revenue" 
          className="group relative block p-6 bg-surface border border-border rounded-3xl shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-success/10 rounded-2xl text-success group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <TrendingUp size={24} />
            </div>
            <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 group-hover:text-success transition-all" />
          </div>
          <h3 className="text-xl font-bold font-heading text-text-primary group-hover:text-success transition-colors">Financial Reports</h3>
          <p className="text-text-muted mt-2 text-xs leading-relaxed">
            Detailed breakdown of earnings, top-selling items, and seasonal growth trends across the platform.
          </p>
        </Link>
      </div>

    </div>
  );
};

export default AdminDashboard;
