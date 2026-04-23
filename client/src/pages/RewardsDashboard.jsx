import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import { Sparkles, Gift, TrendingUp, Award, ChevronRight, CheckCircle, AlertCircle, Ticket, Copy } from 'lucide-react';

const COUPONS = [
  { title: 'Free Dessert',      cost: 1000, emoji: '🍰', color: 'bg-pink-500',   desc: 'Get any dessert item free on your next order.' },
  { title: '15% Off Total',     cost: 2500, emoji: '🏷️', color: 'bg-blue-500',   desc: 'Flat 15% discount on your total cart value.' },
  { title: 'Free Main Course',  cost: 5000, emoji: '🍱', color: 'bg-orange-500', desc: 'Enjoy any main course item completely free.' },
];

const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white text-sm font-bold animate-fade-in-down
    ${type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}>
    {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
    {msg}
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100 text-lg leading-none">&times;</button>
  </div>
);

const RewardsDashboard = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [user, setUser]         = useState(null);
  const [orders, setOrders]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);  // coupon title being redeemed
  const [toast, setToast]       = useState(null);
  const [showAll, setShowAll]   = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        axiosInstance.get('/auth/profile'),
        axiosInstance.get('/orders/mine'),
      ]);
      setUser(profileRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error('Failed to load rewards data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRedeem = async (coupon) => {
    if (redeeming) return;
    setRedeeming(coupon.title);
    try {
      const { data } = await axiosInstance.post('/auth/redeem', { cost: coupon.cost, title: coupon.title });
      setUser(prev => ({ 
        ...prev, 
        loyaltyPoints: data.loyaltyPoints,
        vouchers: [...(prev.vouchers || []), data.voucher]
      }));
      showToast(`🎉 "${coupon.title}" voucher redeemed! Code: ${data.voucherCode}`, 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Redemption failed. Try again.', 'error');
    } finally {
      setRedeeming(null);
    }
  };

  const copyToClipboard = (text, msg = 'Copied to clipboard!') => {
    navigator.clipboard.writeText(text);
    showToast(msg, 'success');
  };

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  const points = user?.loyaltyPoints || 0;
  const nextMilestone = 5000;
  const progress = Math.min((points / nextMilestone) * 100, 100);

  // Build points history from real orders
  const historyItems = orders.map(order => ({
    id: order._id,
    label: `Order #${order._id.slice(-6).toUpperCase()}`,
    date: new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    pts: Math.floor(Number(order.totalPrice) * 10),
  }));

  const displayedHistory = showAll ? historyItems : historyItems.slice(0, 5);
  const activeVouchers = user?.vouchers?.filter(v => !v.isUsed) || [];

  return (
    <div className="py-8 space-y-10 animate-fade-in-up">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Header & Stats ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
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
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-[2rem] p-8 flex flex-col justify-center items-center text-center space-y-6 shadow-xl relative group overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary border border-primary/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <Gift size={40} />
          </div>
          <div>
            <h3 className="text-xl font-black text-text-primary">Refer a Friend</h3>
            <p className="text-sm text-text-muted mt-2">Give ₹200, Get 500 Pts</p>
          </div>
          <button
            onClick={() => copyToClipboard(`${window.location.origin}/register`, 'Invite link copied! 🎉')}
            className="w-full py-4 bg-text-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all"
          >
            Copy Invite Link
          </button>
        </div>
      </div>

      {/* ── Available Vouchers ── */}
      {activeVouchers.length > 0 && (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary"><Ticket size={20} /></div>
            <h2 className="text-2xl font-heading font-black text-text-primary">Your Active Vouchers</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeVouchers.map((v, i) => (
              <div key={i} className="bg-white border-2 border-dashed border-primary/30 rounded-3xl p-5 relative overflow-hidden group hover:border-primary transition-colors">
                <div className="absolute -right-4 -top-4 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
                <p className="text-[10px] font-black uppercase text-primary/60 mb-1">{v.title}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading font-black text-lg tracking-wider text-text-primary">{v.code}</span>
                  <button 
                    onClick={() => copyToClipboard(v.code, 'Voucher code copied! 🎫')}
                    className="p-2 bg-background hover:bg-primary/10 text-text-muted hover:text-primary rounded-xl transition-all"
                  >
                    <Copy size={14} />
                  </button>
                </div>
                <p className="text-[8px] font-bold text-text-muted mt-3 uppercase tracking-widest">Use at checkout</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Redeem Coupons ── */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-xl text-orange-500"><Award size={20} /></div>
          <h2 className="text-2xl font-heading font-black text-text-primary">Redeem Your Points</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COUPONS.map((coupon) => {
            const canRedeem = points >= coupon.cost;
            const isRedeeming = redeeming === coupon.title;
            return (
              <div key={coupon.title} className="group bg-surface border border-border rounded-3xl p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div className={`text-4xl w-16 h-16 ${coupon.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {coupon.emoji}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-text-muted">Required</p>
                    <p className="text-xl font-black text-primary">{coupon.cost.toLocaleString()} Pts</p>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-text-primary mb-2">{coupon.title}</h4>
                <p className="text-xs text-text-muted mb-6 flex-1">{coupon.desc}</p>
                <button
                  disabled={!canRedeem || isRedeeming}
                  onClick={() => handleRedeem(coupon)}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    canRedeem
                      ? 'bg-text-primary text-white hover:bg-black active:scale-95'
                      : 'bg-background text-text-muted border border-border cursor-not-allowed'
                  }`}
                >
                  {isRedeeming ? <Spinner size={16} /> : canRedeem ? 'Redeem Voucher' : 'Not Enough Points'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Points History ── */}
      <div className="bg-surface border border-border rounded-[2rem] overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-500"><TrendingUp size={20} /></div>
            <h2 className="text-xl font-heading font-black text-text-primary">Points History</h2>
          </div>
          <button
            onClick={() => navigate('/orders/mine')}
            className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1"
          >
            View All <ChevronRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background">
                <th className="px-8 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Transaction</th>
                <th className="px-8 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest text-right">Points Earned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {displayedHistory.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-8 py-12 text-center text-text-muted text-sm">
                    No orders yet. Place your first order to start earning points! 🍽️
                  </td>
                </tr>
              ) : (
                displayedHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-background transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          <ChevronRight size={14} className="rotate-[-45deg]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{row.label}</p>
                          <p className="text-[10px] text-text-muted uppercase">{row.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-green-500">+{row.pts.toLocaleString()} Pts</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {historyItems.length > 5 && (
          <div className="px-8 pb-6 pt-2 text-center">
            <button
              onClick={() => setShowAll(v => !v)}
              className="text-[10px] font-black uppercase text-primary hover:underline"
            >
              {showAll ? 'Show Less ▲' : `Show ${historyItems.length - 5} More ▼`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardsDashboard;
