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

    if (isLoading && !stats) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

    const maxVal = stats ? Math.max(...stats.breakdown.map(b => b.value), 1) : 1;

    return (
        <div className="py-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/admin')}
                        className="p-2 hover:bg-surface rounded-full transition-colors border border-border"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-text-primary">Revenue Analytics</h1>
                        <p className="text-text-muted">Track your restaurant's financial performance</p>
                    </div>
                </div>
                
                <div className="flex bg-surface p-1 rounded-xl border border-border">
                    {['all', 'weekly', 'monthly', 'yearly'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                period === p 
                                ? 'bg-primary text-white shadow-md' 
                                : 'text-text-muted hover:text-text-primary'
                            }`}
                        >
                            {p === 'all' ? 'All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
                    { label: 'Delivered Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
                    { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-secondary', bg: 'bg-secondary/10' },
                ].map((card, i) => (
                    <div key={i} className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-text-muted mb-1">{card.label}</p>
                                <h3 className={`text-3xl font-bold font-heading ${card.color}`}>{card.value}</h3>
                            </div>
                            <div className={`${card.bg} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-2">
                        <BarChart2 className="text-primary" size={24} />
                        <h3 className="text-xl font-bold font-heading">Revenue Breakdown</h3>
                    </div>
                    <p className="text-sm text-text-muted bg-background px-3 py-1 rounded-full border border-border">
                        {period === 'all' ? 'All Time Performance' : period === 'weekly' ? 'Last 7 Days' : period === 'monthly' ? 'Last 30 Days' : 'Monthly (Current Year)'}
                    </p>
                </div>

                <div className="relative h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[1, 2, 3, 4].map((_, i) => (
                            <div key={i} className="w-full border-t border-border/50 border-dashed mr-4"></div>
                        ))}
                    </div>

                    {stats?.breakdown.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            {/* Bar Tooltip */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-text-primary text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-lg">
                                ₹{item.value.toFixed(2)} ({item.count} orders)
                            </div>
                            
                            {/* The Bar */}
                            <div 
                                className="w-full max-w-[40px] bg-primary rounded-t-lg transition-all duration-700 ease-out hover:bg-primary-dark cursor-pointer relative"
                                style={{ 
                                    height: `${(item.value / maxVal) * 100}%`,
                                    minHeight: item.value > 0 ? '4px' : '0px'
                                }}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
                            </div>
                            
                            {/* Label */}
                            <p className="text-[10px] md:text-xs text-text-muted mt-4 font-medium uppercase truncate w-full text-center">
                                {item.label}
                            </p>
                        </div>
                    ))}
                    
                    {stats?.breakdown.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center text-text-muted italic">
                            No revenue data for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Insight Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20">
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold font-heading mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-secondary" />
                        Performance Summary
                    </h3>
                    <div className="space-y-4">
                        <p className="text-sm text-text-muted">
                            Based on your **{period}** data, the restaurant has processed **{stats.totalOrders}** successful deliveries. 
                            The highest revenue recorded was **₹{maxVal.toFixed(2)}** in a single period.
                        </p>
                        <div className="p-4 bg-background rounded-xl border border-border border-l-4 border-l-primary">
                            <p className="text-sm italic text-text-muted">
                                "Tip: Try offering limited-time discounts during low-revenue days to boost your {period} average."
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-surface p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center text-center space-y-4">
                    <div className="p-4 bg-success/10 rounded-full">
                        <TrendingUp className="text-success" size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold">Automated Reporting</h4>
                        <p className="text-sm text-text-muted mt-1 px-4">
                            These statistics are updated in real-time as orders are marked as **'Delivered'**.
                        </p>
                    </div>
                    <Button variant="outline" className="text-xs" onClick={() => window.print()}>
                        Export Report PDF
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AdminRevenuePage;
