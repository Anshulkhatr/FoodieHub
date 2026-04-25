import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Ticket, ChevronLeft, ShoppingCart, Info, Sparkles } from 'lucide-react';
import { removeItem, updateQty, clearCart, setVoucher } from '../features/cart/cartSlice';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import PaymentModal from '../components/PaymentModal';

const CartPage = () => {
  const { items, appliedVoucher } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // Calculate discount
  let discount = 0;
  if (appliedVoucher) {
    if (appliedVoucher.type === 'percentage') {
      discount = Math.floor((subtotal * appliedVoucher.value) / 100);
    } else if (appliedVoucher.type === 'free_item') {
      const eligibleItems = items.filter(i => 
        i.category.toLowerCase().replace(/s$/, '') === appliedVoucher.category.toLowerCase().replace(/s$/, '')
      );
      if (eligibleItems.length > 0) {
        const cheapest = [...eligibleItems].sort((a, b) => a.price - b.price)[0];
        discount = cheapest.price;
      }
    }
  }

  const total = Math.max(0, subtotal - discount);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;
    setIsApplyingVoucher(true);
    setVoucherError('');
    try {
      const { data } = await axiosInstance.post('/auth/apply-voucher', { 
        code: voucherCode.toUpperCase(),
        cartTotal: subtotal
      });
      
      if (data.type === 'free_item') {
        const hasCategory = items.some(i => 
          i.category.toLowerCase().replace(/s$/, '') === data.category.toLowerCase().replace(/s$/, '')
        );
        if (!hasCategory) {
          setVoucherError(`Add a ${data.category} item to use this voucher`);
          setIsApplyingVoucher(false);
          return;
        }
      }

      dispatch(setVoucher(data));
      setVoucherCode('');
      setIsApplyingVoucher(false);
    } catch (error) {
      setVoucherError(error.response?.data?.message || 'Invalid voucher code');
      setIsApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    dispatch(setVoucher(null));
  };

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderData = {
        items: items.map(i => ({
          menuItem: i.menuItem,
          quantity: i.quantity,
          price: i.price
        })),
        totalPrice: total
      };
      
      await axiosInstance.post('/orders', orderData);

      if (appliedVoucher) {
        await axiosInstance.post('/auth/mark-voucher-used', { code: appliedVoucher.code });
      }

      dispatch(clearCart());
      navigate('/orders/mine');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenPayment = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
        <div className="w-32 h-32 bg-surface rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl border border-border/50 relative group">
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500">🥡</span>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white shadow-lg">
                <Plus size={20} strokeWidth={3} />
            </div>
        </div>
        <h3 className="text-3xl md:text-4xl font-heading font-black text-text-primary mb-3 tracking-tighter uppercase">Your Tray is Empty</h3>
        <p className="text-text-muted mb-10 max-w-md leading-relaxed font-medium">
          The kitchen is prepped and the chefs are ready. Let's fill your cart with something extraordinary!
        </p>
        <Link 
          to="/menu"
          className="px-10 py-5 bg-text-primary text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl hover:bg-black transition-all transform active:scale-95 flex items-center gap-3"
        >
          Explore Our Collection
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        onConfirm={handleCheckout}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest mb-4"
          >
            <ChevronLeft size={14} strokeWidth={3} />
            Continue Shopping
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                <ShoppingBag size={28} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-text-primary tracking-tighter uppercase">Cart Summary</h1>
              <p className="text-xs font-black uppercase tracking-widest text-text-muted/60 mt-1 flex items-center gap-2">
                <Sparkles size={12} className="text-primary" />
                Review your selection before checkout
              </p>
            </div>
          </div>
        </div>
        <div className="bg-surface border border-border/50 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-600">
            <ShoppingCart size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Cart Status</p>
            <p className="text-sm font-bold text-text-primary">{items.length} Unique Items Selected</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-4 text-[10px] font-black uppercase tracking-[0.2em] text-text-muted/40 mb-2">
            <span>Product Details</span>
            <span className="hidden md:block">Quantity & Price</span>
          </div>
          
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div 
                key={item.menuItem} 
                className="group flex flex-col md:flex-row md:items-center gap-6 p-5 bg-white rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image */}
                <div className="relative w-full md:w-32 h-32 rounded-3xl overflow-hidden shadow-lg flex-shrink-0 bg-background border border-border/50">
                    <img 
                      src={item.image || 'https://placehold.co/400x400?text=Food'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-2 left-2 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-primary border border-primary/10">
                      {item.category}
                    </div>
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-heading font-black text-text-primary text-xl tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                        <button 
                            onClick={() => dispatch(removeItem(item.menuItem))} 
                            className="text-text-muted hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-xl md:hidden"
                        >
                          <Trash2 size={18} />
                        </button>
                    </div>
                    <p className="text-sm text-text-muted mb-4 line-clamp-1 opacity-70">Hand-prepared using the finest local ingredients and authentic recipes.</p>
                    
                    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-text-muted/50">
                      <span className="flex items-center gap-1.5"><Info size={12} /> Unit: ₹{item.price.toFixed(0)}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between md:justify-end gap-8 pt-4 md:pt-0 border-t md:border-t-0 border-border/50">
                    <div className="flex items-center bg-background rounded-2xl p-1.5 border border-border/50 shadow-inner">
                        <button 
                            onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: Math.max(1, item.quantity - 1)}))}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all active:scale-90"
                        >
                            <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-12 text-center text-sm font-black">{item.quantity}</span>
                        <button 
                            onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: item.quantity + 1}))}
                            className="w-10 h-10 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all active:scale-90"
                        >
                            <Plus size={14} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="text-right min-w-[100px]">
                      <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-1">Total</p>
                      <p className="font-heading font-black text-primary text-2xl">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>

                    <button 
                        onClick={() => dispatch(removeItem(item.menuItem))} 
                        className="text-text-muted hover:text-red-500 transition-all p-3 hover:bg-red-50 rounded-2xl hidden md:block"
                    >
                      <Trash2 size={20} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8">
             <div className="bg-surface/50 border border-border/50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-border/50">
                    🚚
                   </div>
                   <div>
                      <h4 className="font-bold text-text-primary uppercase tracking-tight">Express Culinary Delivery</h4>
                      <p className="text-sm text-text-muted">Estimated arrival in <span className="text-primary font-bold">25-35 minutes</span> to your location.</p>
                   </div>
                </div>
                <button 
                  onClick={() => dispatch(clearCart())}
                  className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-all border border-red-100"
                >
                  Clear Entire Cart
                </button>
             </div>
          </div>
        </div>

        {/* Sidebar / Checkout */}
        <div className="space-y-8 sticky top-32">
          {/* Voucher Section */}
          <div className="bg-white border border-border/50 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Ticket size={20} className="text-primary" />
                <h3 className="font-heading font-black text-text-primary uppercase tracking-tighter text-xl">Promotions</h3>
              </div>

              {appliedVoucher ? (
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl animate-fade-in-up">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Active Reward</p>
                    <button 
                      onClick={handleRemoveVoucher}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <h4 className="font-bold text-text-primary text-sm mb-1">{appliedVoucher.title}</h4>
                  <p className="text-xs font-bold text-primary bg-white/50 inline-block px-2 py-0.5 rounded-md border border-primary/10">Code: {appliedVoucher.code}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="ENTER VOUCHER CODE"
                      className="w-full bg-background border border-border/50 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    />
                    {isApplyingVoucher && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Spinner size={18} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleApplyVoucher}
                    disabled={!voucherCode.trim() || isApplyingVoucher}
                    className="w-full py-4 bg-text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 transition-all shadow-lg"
                  >
                    Apply Discount
                  </button>
                  {voucherError && (
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight text-center">{voucherError}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-text-primary text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-0 group-hover:scale-110 transition-transform duration-1000"></div>
            
            <div className="relative z-10 space-y-6">
              <h3 className="font-heading font-black uppercase tracking-tighter text-2xl text-white/90 border-b border-white/10 pb-4">Order Total</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>Subtotal</span>
                    <span className="text-white">₹{subtotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                      <span>Voucher Discount</span>
                      <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-white/60">
                    <span>Delivery Fee</span>
                    <span className="text-green-400">FREE</span>
                </div>
                
                <div className="h-px bg-white/10 my-6"></div>
                
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Final Amount</p>
                        <span className="font-heading font-black text-4xl tracking-tighter">₹{total.toFixed(0)}</span>
                    </div>
                    <div className="text-right">
                         <span className="block text-[8px] font-black uppercase text-green-400 bg-green-400/10 px-2 py-1 rounded-lg border border-green-400/20">Tax Included</span>
                    </div>
                </div>
              </div>

              <button 
                className="w-full h-18 bg-primary text-white rounded-2xl shadow-xl hover:bg-orange-600 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group/btn mt-4 overflow-hidden relative"
                onClick={handleOpenPayment}
                disabled={isSubmitting}
              >
                  {isSubmitting ? (
                      <Spinner size={24} className="text-white" />
                  ) : (
                      <>
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                          <span className="relative z-10 text-xs font-black uppercase tracking-[0.2em]">{user ? 'Confirm & Pay' : 'Login to Continue'}</span>
                          <ArrowRight size={20} className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                      </>
                  )}
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-4 opacity-40">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                <p className="text-[10px] font-black uppercase tracking-tighter">Encrypted Transaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
