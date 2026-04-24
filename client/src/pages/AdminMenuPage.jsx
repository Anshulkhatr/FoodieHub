import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { Plus, Edit2, Trash2, Utensils, Eye, EyeOff } from 'lucide-react';

const AdminMenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, []);


  const fetchMenu = async () => {
    try {
      const { data } = await axiosInstance.get('/menu/admin');
      setMenu(data);
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const openAddModal = () => {
    navigate('/admin/menu/add');
  };

  const openEditModal = (item) => {
    navigate(`/admin/menu/edit/${item._id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axiosInstance.delete(`/menu/${id}`);
      setMenu(menu.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete item', error);
      alert('Failed to delete item');
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  return (
    <div className="py-8 space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Utensils className="text-primary" size={20} />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Kitchen Inventory</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-text-primary">Gourmet Collections</h1>
        </div>
        <Button onClick={openAddModal} className="gap-2 px-8 py-4 shadow-xl shadow-primary/20 transform active:scale-95 transition-all">
          <Plus size={18} /> Add New Dish
        </Button>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {menu.map(item => (
          <div key={item._id} className="group bg-surface border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:border-primary/20 transition-all duration-500 flex flex-col h-full">
            <div className="relative h-48 overflow-hidden bg-background">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
              )}
              <div className="absolute top-3 right-3 flex gap-1.5">
                   <div className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm border ${item.isAvailable ? 'bg-success/90 text-white border-success' : 'bg-red-500/90 text-white border-red-500'}`}>
                        {item.isAvailable ? 'Live' : 'Hidden'}
                   </div>
                   <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-text-primary shadow-sm border border-border/50">
                        {item.category}
                   </div>
                   {item.originalPrice > item.price && (
                     <div className="bg-primary px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-white shadow-sm border border-primary/20 animate-pulse">
                        {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                     </div>
                   )}
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                <div className="flex flex-col items-end">
                  <span className="font-heading font-black text-primary whitespace-nowrap ml-2">₹{item.price?.toFixed(2)}</span>
                  {item.originalPrice > item.price && (
                    <span className="text-[10px] text-text-muted line-through">₹{item.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
              <p className="text-xs text-text-muted line-clamp-2 mb-6 leading-relaxed flex-1">
                {item.desc || 'No description provided for this culinary masterpiece.'}
              </p>
              
              <div className="flex gap-2 p-1 bg-background rounded-2xl border border-border/50 transition-colors group-hover:border-primary/10">
                <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(item); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary hover:bg-white rounded-xl transition-all"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <div className="w-px h-4 self-center bg-border/50"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-red-500 hover:bg-white rounded-xl transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminMenuPage;
