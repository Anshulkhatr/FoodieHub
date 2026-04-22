import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Camera, FileText, Sparkles, Utensils, Search, Filter, Eye, EyeOff, ExternalLink } from 'lucide-react';

const AdminMenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    desc: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    externalLink: '',
    isAvailable: true
  });

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleGenerateDescription = async () => {
    const { name, category } = formData;
    if (!name || !category) {
      alert('Please enter both name and category first to generate a description.');
      return;
    }

    setIsGenerating(true);
    try {
      const { data } = await axiosInstance.post('/admin/ai/generate', { name, category });
      setFormData(prev => ({ ...prev, desc: data.description }));
    } catch (error) {
      console.error('Failed to generate description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      name: '',
      desc: '',
      price: '',
      originalPrice: '',
      category: '',
      image: '',
      externalLink: '',
      isAvailable: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setCurrentItemId(item._id);
    setFormData({
      name: item.name,
      desc: item.desc,
      price: item.price,
      originalPrice: item.originalPrice || '',
      category: item.category,
      image: item.image,
      externalLink: item.externalLink || '',
      isAvailable: item.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined
    };
    
    try {
      if (isEditing) {
        await axiosInstance.put(`/menu/${currentItemId}`, submissionData);
      } else {
        await axiosInstance.post('/menu', submissionData);
      }
      setIsModalOpen(false);
      fetchMenu();
    } catch (error) {
      console.error('Failed to save menu item', error);
      const message = error.response?.data?.message || 'Error saving menu item. Please check all fields.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
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

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Refine Dish Details' : 'Design New Masterpiece'}
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Dish Identity</label>
                    <div className="relative">
                        <input 
                        type="text" name="name" required value={formData.name} onChange={handleInputChange}
                        className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium text-sm"
                        placeholder="e.g. Signature Wagyu"
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Collection / Category</label>
                    <input 
                        type="text" name="category" required value={formData.category} onChange={handleInputChange}
                        className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium text-sm"
                        placeholder="e.g. Grand Entrées"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Price Point (₹)</label>
                    <input 
                        type="number" name="price" step="0.01" required value={formData.price} onChange={handleInputChange}
                        className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-bold text-primary"
                        placeholder="Current Price"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Original Price (₹) - Optional</label>
                    <input 
                        type="number" name="originalPrice" step="0.01" value={formData.originalPrice} onChange={handleInputChange}
                        className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium text-text-muted italic"
                        placeholder="Price before discount"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Direct Pinterest Link</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50"><Camera size={18} /></span>
                        <input 
                            type="text" name="image" required value={formData.image} onChange={handleInputChange}
                            className="w-full p-4 pl-12 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all text-sm"
                            placeholder="https://i.pinimg.com/..."
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Culinary Story</label>
                    <button 
                        type="button" onClick={handleGenerateDescription} disabled={isGenerating}
                        className="group relative overflow-hidden text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {isGenerating ? <Spinner size={12} className="text-white" /> : <Sparkles size={14} className="animate-pulse" />}
                        {isGenerating ? 'AI Conjuring...' : 'Generate with AI'}
                    </button>
                </div>
                <textarea 
                    name="desc" required value={formData.desc} onChange={handleInputChange} rows="4"
                    className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Tell a story about the flavors, heritage, and ingredients..."
                />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-background rounded-2xl border border-border/50">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${formData.isAvailable ? 'bg-success/10 border-success/30 text-success' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                        {formData.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-primary">Steward Visibility</p>
                        <p className="text-[10px] text-text-muted uppercase font-black">{formData.isAvailable ? 'Visible for customers' : 'Hidden from menu'}</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
            </div>

            <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-text-muted hover:bg-background rounded-2xl border border-transparent hover:border-border transition-all">
                    Dismiss
                </button>
                <button type="submit" disabled={isSaving} className="flex-[2] py-4 bg-text-primary text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50">
                    {isSaving ? <Spinner size={16} /> : (isEditing ? 'Update Creation' : 'Publish Dish')}
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenuPage;
