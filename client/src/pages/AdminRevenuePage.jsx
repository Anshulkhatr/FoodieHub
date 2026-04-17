import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, ShoppingBag, Calendar, BarChart2, ChevronLeft } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Button from '../components/Button';

const AdminRevenuePage = () => {
    const { user } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, breakdown: [] });
    const [period, setPeriod] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            setIsLoading(true);
            try {
                const { data } = await axiosInstance.get(`/admin/revenue?period=${period}`);
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch revenue stats', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [period, user, navigate]);

    if (isLoading && (!stats || stats.breakdown.length === 0)) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

    const maxVal = stats ? Math.max(...stats.breakdown.map(b => b.value), 1) : 1;

    return (
        <div className="py-8 space-y-10 animate-fade-in-up">
            <div className="relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-success/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/admin')}
                            className="p-3 hover:bg-surface rounded-2xl transition-all border border-border bg-white shadow-sm hover:shadow active:scale-95"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <BarChart2 className="text-success" size={20} />
                                <span className="text-xs font-bold text-success uppercase tracking-widest">Financial Insights</span>
                            </div>
                            <h1 className="text-3xl font-heading font-extrabold text-text-primary">Revenue Analytics</h1>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center w-full md:w-auto bg-surface p-1.5 rounded-2xl border border-border shadow-sm">
                        {['all', 'weekly', 'monthly', 'yearly'].map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    period === p 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                    : 'text-text-muted hover:text-text-primary hover:bg-background'
                                }`}
                            >
                                {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
                    { label: 'Delivered Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-info', bg: 'bg-info/10' },
                ].map((card, i) => (
                    <div key={i} className="bg-surface p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-current to-transparent opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rounded-bl-full"></div>
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">{card.label}</p>
                                <h3 className={`text-3xl font-extrabold font-heading ${card.color}`}>{card.value}</h3>
                            </div>
                            <div className={`${card.bg} p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm shadow-current/5`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-success/50 via-primary/50 to-info/50 opacity-30"></div>
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-xl border border-border/50">
                            <BarChart2 className="text-primary" size={20} />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-text-primary uppercase tracking-tight">Revenue Breakdown</h3>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-text-primary bg-background px-4 py-2 rounded-xl border border-border shadow-sm">
                        {period === 'all' ? 'Global performance' : period === 'weekly' ? 'Past 7 Days' : period === 'monthly' ? 'Past 30 Days' : 'Monthly Distribution'}
                    </p>
                </div>

                <div className="relative h-72 flex items-end justify-between gap-3 md:gap-6 px-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-2">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="w-full border-t border-border/30 border-dashed"></div>
                        ))}
                    </div>

                    {stats?.breakdown.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end z-10">
                            {/* Bar Tooltip */}
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-20 shadow-2xl scale-90 group-hover:scale-100">
                                ₹{item.value.toFixed(2)} <span className="text-white/50 ml-1">· {item.count} items</span>
                            </div>
                            
                            {/* The Bar */}
                            <div 
                                className="w-full max-w-[48px] bg-gradient-to-t from-primary to-orange-400 rounded-t-xl transition-all duration-700 ease-out hover:from-primary-dark hover:to-primary cursor-pointer relative shadow-lg shadow-primary/10"
                                style={{ 
                                    height: `${(item.value / maxVal) * 100}%`,
                                    minHeight: item.value > 0 ? '6px' : '0px'
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl"></div>
                            </div>
                            
                            {/* Label */}
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-text-muted mt-5 truncate w-full text-center">
                                {item.label}
                            </p>
                        </div>
                    ))}
                    
                    {stats?.breakdown.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-text-muted italic space-y-2">
                             <div className="p-4 bg-background rounded-full"><ShoppingBag size={32} className="opacity-20" /></div>
                             <p className="text-sm font-bold opacity-50 uppercase tracking-widest">No detailed history for this period</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm group hover:border-secondary/20 transition-all">
                    <h3 className="text-lg font-bold font-heading mb-6 flex items-center gap-3">
                        <div className="p-2 bg-secondary/10 rounded-xl text-secondary group-hover:scale-110 transition-transform">
                             <Calendar size={20} />
                        </div>
                        Executive Summary
                    </h3>
                    <div className="space-y-6">
                        <p className="text-sm text-text-muted leading-relaxed">
                            Throughout the **{period}** window, your establishment successfully fulfilled **{stats.totalOrders}** high-quality orders. 
                            Peak performance was observed at **₹{maxVal.toFixed(2)}** for a singular reporting point.
                        </p>
                        <div className="p-6 bg-background rounded-2xl border border-border border-l-4 border-l-primary relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
                            <p className="text-xs font-bold italic text-text-muted relative z-10 leading-relaxed">
                                "Strategic Advisor: Data suggests optimizing your weekend offerings based on these delivery spikes. Consider exclusive digital menu items to further drive order value."
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-surface p-8 rounded-3xl border border-border shadow-sm flex flex-col justify-center items-center text-center space-y-6 group">
                    <div className="p-6 bg-success/10 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm shadow-success/10">
                        <TrendingUp className="text-success" size={40} />
                    </div>
                    <div className="max-w-xs">
                        <h4 className="font-extrabold text-xl font-heading text-text-primary uppercase tracking-tight">Active Reporting</h4>
                        <p className="text-xs text-text-muted mt-2 font-medium leading-relaxed">
                             Live analytics synchronized with our fulfillment engine. Every 'Delivered' status update is reflected globally.
                        </p>
                    </div>
                    <Button variant="outline" className="text-[10px] font-black uppercase tracking-widest px-8 py-3 rounded-2xl" onClick={() => window.print()}>
                        Export Financial Dossier (PDF)
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminRevenuePage;
