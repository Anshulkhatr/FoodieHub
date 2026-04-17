import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { removeItem, updateQty, clearCart } from './cartSlice';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import Spinner from '../../components/Spinner';
import PaymentModal from '../../components/PaymentModal';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPayment, setShowPayment] = React.useState(false);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Gourmet Selection</span>
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

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-8 border-t border-border/50 bg-surface/80 backdrop-blur-xl shadow-[0_-20px_50px_rgba(0,0,0,0.05)] space-y-6">
            <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-muted/60">
                    <span>Subtotal</span>
                    <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-text-muted/60">
                    <span>Delivery</span>
                    <span className="text-success">Complimentary</span>
                </div>
                <div className="h-px bg-border/50 my-2"></div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-1">Estimated Total</p>
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
