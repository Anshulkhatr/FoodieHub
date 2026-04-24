import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { Camera, Sparkles, Utensils, Eye, EyeOff, ArrowLeft, Save, Trash2, Image as ImageIcon } from 'lucide-react';

const AdminEditMenuItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
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

  useEffect(() => {
    if (isEditing) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const { data } = await axiosInstance.get(`/menu/${id}`);
      const item = data.item;
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
    } catch (error) {
      console.error('Failed to fetch menu item:', error);
      alert('Failed to load dish details.');
      navigate('/admin/menu');
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
        await axiosInstance.put(`/menu/${id}`, submissionData);
      } else {
        await axiosInstance.post('/menu', submissionData);
      }
      navigate('/admin/menu');
    } catch (error) {
      console.error('Failed to save menu item', error);
      const message = error.response?.data?.message || 'Error saving menu item. Please check all fields.';
      alert(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Spinner size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/menu')}
            className="p-3 bg-surface border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Utensils className="text-primary" size={16} />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                {isEditing ? 'Curating Perfection' : 'New Creation'}
              </span>
            </div>
            <h1 className="text-3xl font-heading font-black text-text-primary tracking-tight">
              {isEditing ? `Refine ${formData.name || 'Dish'}` : 'Design New Masterpiece'}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/menu')}
            className="flex-1 sm:flex-none"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="flex-1 sm:flex-none gap-2 shadow-xl shadow-primary/20"
          >
            {isSaving ? <Spinner size={18} /> : <><Save size={18} /> {isEditing ? 'Save Changes' : 'Publish Dish'}</>}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-3 space-y-8">
          <section className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-muted mb-8 border-b border-border pb-4">Core Identity</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Dish Name</label>
                  <input 
                    type="text" name="name" required value={formData.name} onChange={handleInputChange}
                    className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium"
                    placeholder="e.g. Signature Wagyu"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Category / Collection</label>
                  <input 
                    type="text" name="category" required value={formData.category} onChange={handleInputChange}
                    className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium"
                    placeholder="e.g. Grand Entrées"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Current Price (₹)</label>
                  <input 
                    type="number" name="price" step="0.01" required value={formData.price} onChange={handleInputChange}
                    className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-bold text-primary text-lg"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Original Price (₹) <span className="italic opacity-50">- Optional</span></label>
                  <input 
                    type="number" name="originalPrice" step="0.01" value={formData.originalPrice} onChange={handleInputChange}
                    className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all font-medium text-text-muted italic"
                    placeholder="Price before discount"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-text-muted">Storytelling & Flavors</h2>
              <button 
                type="button" onClick={handleGenerateDescription} disabled={isGenerating}
                className="group relative overflow-hidden text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-orange-400 text-white rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {isGenerating ? <Spinner size={12} className="text-white" /> : <Sparkles size={14} className="animate-pulse" />}
                {isGenerating ? 'AI Conjuring...' : 'AI Assistant'}
              </button>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Culinary Description</label>
              <textarea 
                name="desc" required value={formData.desc} onChange={handleInputChange} rows="6"
                className="w-full p-5 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all resize-none text-sm leading-relaxed"
                placeholder="Tell a story about the flavors, heritage, and ingredients..."
              />
            </div>
          </section>

          <section className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-muted mb-8 border-b border-border pb-4">Visibility & Availability</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-background rounded-[2rem] border border-border/50">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl border ${formData.isAvailable ? 'bg-success/10 border-success/30 text-success' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  {formData.isAvailable ? <Eye size={24} /> : <EyeOff size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Steward Visibility</p>
                  <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">
                    {formData.isAvailable ? 'Publicly visible for customers' : 'Hidden from the restaurant menu'}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleInputChange} className="sr-only peer" />
                <div className="w-14 h-8 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Visuals & Preview */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface border border-border rounded-[2.5rem] p-8 shadow-sm sticky top-28">
            <h2 className="text-sm font-black uppercase tracking-widest text-text-muted mb-8 border-b border-border pb-4">Visual Masterpiece</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Image Link (Pinterest/Direct)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50"><Camera size={18} /></span>
                  <input 
                    type="text" name="image" required value={formData.image} onChange={handleInputChange}
                    className="w-full p-4 pl-12 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">Live Preview</label>
                <div className="relative group aspect-square rounded-[2rem] overflow-hidden bg-background border border-border shadow-inner flex items-center justify-center">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = ''; }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-text-muted/30">
                      <ImageIcon size={48} strokeWidth={1} />
                      <p className="text-xs font-bold uppercase tracking-widest">No Image Linked</p>
                    </div>
                  )}
                  
                  {/* Preview Badge Overlays */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/50 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">{formData.category || 'Category'}</span>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 flex flex-col items-end">
                    <div className="bg-primary px-4 py-2 rounded-2xl shadow-xl shadow-primary/30">
                      <span className="text-white font-heading font-black text-lg">₹{Number(formData.price).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-center text-text-muted uppercase font-black tracking-widest">This is how customers will see your dish</p>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest px-1">External Link (Optional)</label>
                <input 
                  type="text" name="externalLink" value={formData.externalLink} onChange={handleInputChange}
                  className="w-full p-4 bg-background border border-border rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary/50 outline-none transition-all text-sm"
                  placeholder="https://pinterest.com/..."
                />
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AdminEditMenuItemPage;
