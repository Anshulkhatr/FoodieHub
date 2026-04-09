import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axiosInstance.get('/orders/mine');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  return (
    <div className="py-6">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-8">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-surface p-12 rounded-2xl border border-border text-center shadow-sm">
          <div className="text-5xl mb-4">🥡</div>
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-text-muted">Hungry? Your next favorite meal is just a few clicks away!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-surface p-6 rounded-2xl border border-border shadow-sm hover:border-primary/30 transition-all">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <p className="text-xs font-mono text-text-muted uppercase tracking-tighter">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                  <p className="text-sm text-text-muted">{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
                <Badge status={order.status} />
              </div>
              
              <div className="border-t border-border/50 py-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm mb-1 text-text-muted">
                    <span>{item.quantity}x {item.menuItem?.name || 'Item'}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="font-medium">Total Paid</span>
                <span className="text-xl font-heading font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
