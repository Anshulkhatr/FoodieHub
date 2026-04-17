import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Badge from '../components/Badge';
import StatusDropdown from '../components/StatusDropdown';
import { Trash2, Package, User, CreditCard, Calendar, Filter, ChevronDown, PackageOpen } from 'lucide-react';

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
      setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this delivered order? This action cannot be undone.')) {
      return;
    }

    try {
      await axiosInstance.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o._id !== id));
    } catch (error) {
      console.error('Failed to delete order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  return (
    <div className="py-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="text-primary" size={20} />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Order Management</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-text-primary">Track All Orders</h1>
        </div>
        
        <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border">
          <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">All Orders</button>
          <button className="px-4 py-2 text-text-muted hover:text-text-primary text-xs font-bold rounded-lg transition-colors">Pending</button>
          <button className="px-4 py-2 text-text-muted hover:text-text-primary text-xs font-bold rounded-lg transition-colors">Delivered</button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border border-dashed rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageOpen className="text-text-muted" size={40} />
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-2">No Orders Found</h3>
            <p className="text-text-muted max-w-sm mx-auto">When customers start placing orders, they will appear here in real-time.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-surface border border-border rounded-3xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-background/50 border-b border-border text-text-muted uppercase text-[10px] font-black tracking-widest">
                  <th className="px-8 py-5">Order ID</th>
                  <th className="px-8 py-5">Customer Details</th>
                  <th className="px-8 py-5">Total Amount</th>
                  <th className="px-8 py-5">Order Date</th>
                  <th className="px-8 py-5">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-background/30 transition-colors group">
                    <td className="px-8 py-6 font-mono text-xs font-bold text-primary">
                        <span className="bg-primary/5 px-2 py-1 rounded">#{order._id?.toString().slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center font-bold text-primary text-sm uppercase">
                            {order.user?.name?.[0] || 'G'}
                        </div>
                        <div>
                            <p className="font-bold text-text-primary">{order.user?.name || 'Guest User'}</p>
                            <p className="text-xs text-text-muted">{order.user?.email || 'No email provided'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 font-heading font-black text-lg text-text-primary">
                      ₹{(order.totalPrice || 0).toFixed(2)}
                    </td>
                    <td className="px-8 py-6 text-sm text-text-muted">
                      <div className="flex items-center gap-1.5 uppercase font-bold text-[10px]">
                        <Calendar size={12} className="text-text-muted/60" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Badge status={order.status} />
                        <div className="flex items-center gap-2">
                          <StatusDropdown currentStatus={order.status} onStatusChange={(s) => handleStatusChange(order._id, s)} />
                          {order.status === 'Delivered' && (
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="p-2.5 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm hover:shadow"
                              title="Delete Order"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-surface rounded-2xl border border-border p-6 space-y-4 shadow-sm active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start">
                   <div>
                        <span className="text-[10px] font-black font-mono text-primary bg-primary/5 px-2 py-1 rounded">#{order._id?.toString().slice(-6).toUpperCase()}</span>
                        <h3 className="font-bold text-text-primary mt-2 flex items-center gap-2">
                            <User size={14} className="text-primary" />
                            {order.user?.name || 'Guest'}
                        </h3>
                   </div>
                   <Badge status={order.status} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Amount</p>
                        <p className="font-heading font-black text-primary">₹{(order.totalPrice || 0).toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Date</p>
                        <p className="text-xs font-bold text-text-primary">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <StatusDropdown currentStatus={order.status} onStatusChange={(s) => handleStatusChange(order._id, s)} />
                    </div>
                    {order.status === 'Delivered' && (
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="p-3 text-red-500 bg-red-50 rounded-xl"
                        >
                          <Trash2 size={18} />
                        </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminOrdersPage;
