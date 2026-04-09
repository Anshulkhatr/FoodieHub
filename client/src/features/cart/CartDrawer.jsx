import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, Trash2, Minus, Plus } from 'lucide-react';
import { removeItem, updateQty, clearCart } from './cartSlice';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const CartDrawer = ({ isOpen, onClose }) => {
  const { items } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity flex" onClick={onClose} />
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-surface shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-border flex justify-between items-center bg-background/50">
          <h2 className="text-xl font-heading font-bold text-text-primary flex items-center gap-2">
            Your Cart <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-primary transition-colors rounded-full hover:bg-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/30">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted">
              <span className="text-4xl mb-4">🛒</span>
              <p className="font-medium">Your cart is empty</p>
              <Button variant="ghost" className="mt-4" onClick={onClose}>Continue Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.menuItem} className="flex gap-4 p-3 bg-surface rounded-xl border border-border shadow-sm">
                <img src={item.image || 'https://placehold.co/200x200?text=No+Image'} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-border" />
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-text-primary leading-tight line-clamp-1">{item.name}</h4>
                    <button onClick={() => dispatch(removeItem(item.menuItem))} className="text-text-muted hover:text-red-500 transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="text-primary font-bold mt-1">${item.price.toFixed(2)}</div>
                  <div className="flex items-center mt-auto pt-2">
                    <div className="flex items-center bg-background border border-border rounded-lg overflow-hidden">
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: Math.max(1, item.quantity - 1)}))}
                        className="p-1 px-2 text-text-muted hover:text-primary hover:bg-surface transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQty({ id: item.menuItem, quantity: item.quantity + 1}))}
                        className="p-1 px-2 text-text-muted hover:text-primary hover:bg-surface transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-border bg-surface shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center mb-4 text-lg">
              <span className="font-medium text-text-muted">Total</span>
              <span className="font-heading font-bold text-primary text-xl">${total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full h-12 text-lg shadow-md" 
              onClick={handleCheckout}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {user ? 'Place Order' : 'Login to Checkout'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
