import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { Sparkles, Gift, TrendingUp, Award, ChevronRight, Ticket } from 'lucide-react';

const RewardsDashboard = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get('/auth/profile');
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  const points = user?.loyaltyPoints || 0;
  const nextMilestone = 5000;
  const progress = Math.min((points / nextMilestone) * 100, 100);

  const coupons = [
    { title: 'Free Dessert', cost: 1000, icon: '🍰', color: 'bg-pink-500' },
    { title: '15% Off Total', cost: 2500, icon: '🏷️', color: 'bg-blue-500' },
    { title: 'Free Main Course', cost: 5000, icon: '🍱', color: 'bg-orange-500' },
  ];

  return (
    <div className="py-8 space-y-10 animate-fade-in-up">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                <Sparkles size={16} className="text-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">Elite Foodie Club</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-heading font-black">Bonjour, {user?.name}!</h1>
              <p className="text-gray-400 max-w-md">Your culinary journey has earned you exclusive rewards. Keep savoring, keep earning.</p>
            </div>

            <div className="mt-12 space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Current Balance</p>
                  <p className="text-5xl font-black text-primary">{points.toLocaleString()} <span className="text-lg text-gray-400">Pts</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Next Milestone</p>
                  <p className="text-lg font-bold">Gold Tier at 5,000</p>
                </div>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden border border-white/5 p-1">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[2rem] p-8 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Gift size={40} />
            </div>
            <div>
                <h3 className="text-xl font-black text-text-primary">Refer a Friend</h3>
                <p className="text-sm text-text-muted mt-2">Give ₹200, Get 500 Pts</p>
            </div>
            <button className="w-full py-4 bg-text-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all">
                Copy Invite Link
            </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-xl text-orange-500">
                <Award size={20} />
            </div>
            <h2 className="text-2xl font-heading font-black text-text-primary">Redeem Your Points</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coupons.map((coupon, i) => (
                <div key={i} className="group bg-surface border border-border rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                        <div className={`text-4xl w-16 h-16 ${coupon.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                            {coupon.icon}
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-text-muted">Required</p>
                            <p className="text-xl font-black text-primary">{coupon.cost} Pts</p>
                        </div>
                    </div>
                    <h4 className="text-lg font-bold text-text-primary mb-2">{coupon.title}</h4>
                    <p className="text-xs text-text-muted mb-6 flex-1">Valid at any FoodieHub outlet or for online delivery orders.</p>
                    <button 
                        disabled={points < coupon.cost}
                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            points >= coupon.cost 
                            ? 'bg-text-primary text-white hover:bg-black' 
                            : 'bg-background text-text-muted border border-border cursor-not-allowed'
                        }`}
                    >
                        {points >= coupon.cost ? 'Redeem Voucher' : 'Not Enough Points'}
                    </button>
                </div>
            ))}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-surface border border-border rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-500">
                    <TrendingUp size={20} />
                </div>
                <h2 className="text-xl font-heading font-black text-text-primary">Points History</h2>
            </div>
            <button className="text-[10px] font-black uppercase text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-background">
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Transaction</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest text-right">Amount</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-background transition-colors">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <ChevronRight size={14} className="rotate-[-45deg]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary">Order Reward #12345</p>
                                    <p className="text-[10px] text-text-muted uppercase">Today, 12:30 PM</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-success">+450 Pts</td>
                    </tr>
                    <tr className="hover:bg-background transition-colors">
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <ChevronRight size={14} className="rotate-[-45deg]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-primary">Referral Bonus</p>
                                    <p className="text-[10px] text-text-muted uppercase">Yesterday, 09:15 AM</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-8 py-6 text-right font-black text-success">+500 Pts</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;
