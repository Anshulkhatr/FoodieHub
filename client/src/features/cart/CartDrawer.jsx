import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart, Ticket, CheckCircle2 } from 'lucide-react';
import { removeItem, updateQty, clearCart, setVoucher } from './cartSlice';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Spinner from '../../components/Spinner';
import PaymentModal from '../../components/PaymentModal';

const CartDrawer = ({ isOpen, onClose }) => {
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
      // Find eligible items in the cart
      const eligibleItems = items.filter(i => 
        i.category.toLowerCase().replace(/s$/, '') === appliedVoucher.category.toLowerCase().replace(/s$/, '')
      );
      if (eligibleItems.length > 0) {
        // Free item is usually the cheapest one of that category
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
      
      // Additional check for free_item category
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
      onClose();
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

      // If voucher was used, mark it as used in DB
      if (appliedVoucher) {
        await axiosInstance.post('/auth/mark-voucher-used', { code: appliedVoucher.code });
      }

      dispatch(clearCart());
      onClose();
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
      onClose();
      navigate('/login');
      return;
    }
    setShowPayment(true);
  };

  return (
    <>
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        onConfirm={handleCheckout}
      />

      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-[0_0_100px_rgba(0,0,0,0.2)] z-[70] transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-surface/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <ShoppingBag size={20} />
            </div>
            <div>
                <h2 className="text-xl font-heading font-black text-text-primary uppercase tracking-tighter">Your Selection</h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">{items.length} Culinary Items</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 text-text-muted hover:text-primary transition-all rounded-2xl hover:bg-background border border-transparent hover:border-border active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar bg-background/20 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
          
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
              <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mb-6 shadow-xl border border-border/50 relative">
                  <span className="text-5xl">🥡</span>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white border-4 border-white">
                      <Plus size={16} strokeWidth={3} />
                  </div>
              </div>
              <h3 className="text-2xl font-heading font-black text-text-primary mb-2">Taste Buds Waiting?</h3>
              <p className="text-sm text-text-muted mb-8 max-w-[240px] leading-relaxed">Your cart is as empty as a morning market before sunrise. Let's fill it with magic!</p>
              <button 
                onClick={onClose}
                className="px-8 py-4 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all transform active:scale-95"
              >
                Browse Our Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
                {items.map((item, idx) => (
                    <div 
                        key={item.menuItem} 
                        className="flex gap-5 p-4 bg-white rounded-[2rem] border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 group animate-fade-in-up"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md flex-shrink-0 bg-background border border-border/50">
                            <img src={item.image || 'https://placehold.co/200x200?text=Food'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        
                        <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-text-primary leading-tight truncate-1 group-hover:text-primary transition-colors text-sm">{item.name}</h4>
                                <button 
                                    onClick={() => dispatch(removeItem(item.menuItem))} 
                                    className="text-text-muted hover:text-red-500 transition-all p-1.5 hover:bg-red-50 rounded-xl"
                                >
                                <Trash2 size={14} />
                                </button>
                            </div>
                            <div className="flex items-center gap-1.5 mb-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">{item.category}</span>
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <span className="font-heading font-black text-primary text-lg">₹{item.price.toFixed(2)}</span>
                                <div className="flex items-center bg-background rounded-xl p-1 border border-border/50 shadow-inner">
                                    <button 
                                        onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: Math.max(1, item.quantity - 1)}))}
                                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white rounded-lg transition-all"
                                    >
                                        <Minus size={12} strokeWidth={3} />
                                    </button>
                                    <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                    <button 
                                        onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: item.quantity + 1}))}
                                        className="w-8 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-white rounded-lg transition-all"
                                    >
                                        <Plus size={12} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

        {/* Voucher Section */}
        {items.length > 0 && user && (
          <div className="px-6 py-4 bg-surface/30 border-t border-border/50">
            {appliedVoucher ? (
              <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-4 rounded-2xl animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Ticket size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">Applied Voucher</p>
                    <h4 className="font-bold text-text-primary text-sm">{appliedVoucher.title} ({appliedVoucher.code})</h4>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveVoucher}
                  className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket size={14} className="text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Have a Voucher?</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="ENTER CODE"
                      className="w-full bg-white border border-border/50 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-widest focus:border-primary/50 focus:ring-0 transition-all"
                    />
                    {isApplyingVoucher && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Spinner size={16} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={handleApplyVoucher}
                    disabled={!voucherCode.trim() || isApplyingVoucher}
                    className="px-6 bg-text-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black disabled:opacity-50 transition-all"
                  >
                    Apply
                  </button>
                </div>
                {voucherError && (
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight">{voucherError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-border/50 bg-surface/80 backdrop-blur-xl shadow-[0_-20px_50px_rgba(0,0,0,0.05)] space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-muted/60">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-success">
                      <span>Voucher Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-muted/60">
                    <span>Delivery</span>
                    <span className="text-success">Complimentary</span>
                </div>
                <div className="h-px bg-border/50 my-2"></div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-1">Final Total</p>
                        <span className="font-heading font-black text-text-primary text-3xl">₹{total.toFixed(2)}</span>
                    </div>
                    <div className="text-right">
                         <span className="block text-[10px] font-black uppercase text-success bg-success/10 px-2 py-1 rounded-lg border border-success/20">Tax Included</span>
                    </div>
                </div>
            </div>

            <button 
              className="group relative w-full h-16 bg-text-primary text-white rounded-2xl overflow-hidden shadow-2xl transition-all hover:bg-black active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              onClick={handleOpenPayment}
              disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <Spinner size={24} className="text-white" />
                ) : (
                    <>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{user ? 'Finalize Order' : 'Authenticating...'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
            <p className="text-center text-[10px] font-bold text-text-muted uppercase tracking-tighter opacity-50">Secure culinary fulfillment guaranteed</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
