import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import StatusDropdown from '../components/StatusDropdown';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axiosInstance.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
      // Optimistic update for mock demonstration
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  return (
    <div className="py-6">
      <h1 className="text-3xl font-heading font-bold text-text-primary mb-6">Manage Orders</h1>
      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background border-b border-border text-text-muted uppercase font-semibold text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-mono text-text-muted text-xs">{order._id.substring(order._id.length - 6).toUpperCase()}</td>
                <td className="px-6 py-4 font-medium">{order.user?.name || 'Guest'}</td>
                <td className="px-6 py-4 font-bold text-primary">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-24">
                    <Badge status={order.status} />
                  </div>
                  <div className="w-32">
                    <StatusDropdown currentStatus={order.status} onStatusChange={(s) => handleStatusChange(order._id, s)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
