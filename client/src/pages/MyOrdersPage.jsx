import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

import DeliveryPrompt from '../components/DeliveryPrompt';
import OrderTracker from '../components/OrderTracker';
import { Sparkles, History, ShoppingBag } from 'lucide-react';
import Button from '../components/Button';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiStatuses, setAiStatuses] = useState({});

  const [error, setError] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get('/orders/mine');
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setError('Failed to load your orders. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
    // Refresh every minute to update automation states
    const interval = setInterval(fetchMyOrders, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status: newStatus });
      fetchMyOrders();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const checkAiStatus = async (orderId, status, createdAt) => {
    const ageInMinutes = (Date.now() - new Date(createdAt).getTime()) / 60000;
    try {
      const { data } = await axiosInstance.post('/admin/ai/order-status', { status, ageInMinutes });
      setAiStatuses(prev => ({ ...prev, [orderId]: data.update }));
    } catch (err) {
      console.error('AI status fail:', err);
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  if (error) {
    return (
      <div className="py-6 text-center">
        <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-2xl mb-4">
          <p className="font-medium">{error}</p>
        </div>
        <Button onClick={fetchMyOrders}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-text-primary">My Orders</h1>
        <Button variant="secondary" onClick={fetchMyOrders} className="gap-2">
          <History size={16} /> Sync Status
        </Button>
      </div>
      
      {orders.length === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-border text-center shadow-sm">
          <div className="text-5xl mb-4">🥡</div>
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-text-muted">Hungry? Your next favorite meal is just a few clicks away!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => {
            const ageInMinutes = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
            const isEligibleForPrompt = order.status === 'Ready' || order.status === 'Out for Delivery';
            const needsPrompt = isEligibleForPrompt && ageInMinutes >= 16;
            
            return (
              <div key={order._id} className="relative">
                <div className={`bg-surface p-6 rounded-2xl border ${needsPrompt ? 'border-primary' : 'border-border'} shadow-sm transition-all overflow-hidden`}>
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-xs font-mono text-text-muted uppercase tracking-tighter">Order #{order._id ? order._id.toString().substring(order._id.toString().length - 8).toUpperCase() : 'UNKNOWN'}</p>
                      <p className="text-sm text-text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' }) : 'Date Unknown'}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {order.status !== 'Delivered' && (
                        <button 
                          onClick={() => checkAiStatus(order._id, order.status, order.createdAt)}
                          className="text-primary hover:text-primary-dark p-1.5 bg-primary/10 rounded-lg transition-colors"
                          title="Ask AI Assistant"
                        >
                          <Sparkles size={16} />
                        </button>
                      )}
                      <Badge status={order.status} />
                    </div>
                  </div>
                  
                  <OrderTracker status={order.status} statusHistory={order.statusHistory} />
                  
                  {aiStatuses[order._id] && (
                    <div className="bg-background/50 border-l-2 border-primary p-3 mb-4 rounded-r-lg text-sm italic text-text-muted animate-in slide-in-from-left-2 duration-300">
                      &quot;{aiStatuses[order._id]}&quot;
                    </div>
                  )}

                  <div className="border-t border-border/50 py-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm mb-1 text-text-muted">
                        <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                        <span>₹{((item.price || 0) * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border pt-4 flex justify-between items-center">
                    <span className="font-medium">Total Paid</span>
                    <span className="text-xl font-heading font-bold text-primary">₹{(order.totalPrice || 0).toFixed(2)}</span>
                  </div>

                  {needsPrompt && (
                    <DeliveryPrompt 
                      aiMessage="My sensors indicate your order should have arrived by now! Is everything delicious?"
                      onConfirm={() => handleUpdateStatus(order._id, 'Delivered')}
                      onCancel={() => alert("We're sorry! AI estimates can be slightly off. Your food is on its way.")}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
