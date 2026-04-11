import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2, Camera, FileText, Sparkles } from 'lucide-react';

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
      category: item.category,
      image: item.image,
      externalLink: item.externalLink || '',
      isAvailable: item.isAvailable
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      price: Number(formData.price)
    };
    
    console.log('Submitting Item Data:', submissionData);

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

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-heading font-bold text-text-primary">Manage Menu</h1>
        <Button onClick={openAddModal} className="gap-2">
          <Plus size={18} /> Add Item
        </Button>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-background border-b border-border text-text-muted uppercase font-semibold text-xs tracking-wider">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {menu.map(item => (
              <tr key={item._id} className="hover:bg-background/50 transition-colors">
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 text-text-muted">{item.category}</td>
                <td className="px-6 py-4 font-bold text-primary">₹{(item.price || 0).toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded-md ${item.isAvailable ? 'bg-success/10 text-success' : 'bg-red-500/10 text-red-500'}`}>
                    {item.isAvailable ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 flex items-center justify-end gap-3">
                  <button 
                    className="text-info hover:text-blue-700 transition-colors" 
                    title="Edit"
                    onClick={() => openEditModal(item)}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 transition-colors" 
                    title="Delete" 
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Item Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              placeholder="e.g. Wagyu Truffle Burger"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <input 
                type="text" 
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="e.g. Mains"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Price (₹)</label>
              <input 
                type="number" 
                name="price"
                step="0.01"
                required
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-semibold">Description</label>
              <button 
                type="button"
                onClick={handleGenerateDescription}
                disabled={isGenerating}
                className="text-xs flex items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea 
              name="desc"
              required
              value={formData.desc}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none resize-none"
              placeholder="Describe the dish flavors and ingredients..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Image URL (Direct Pinterest Link)</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  name="image"
                  required
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-10 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="https://i.pinimg.com/originals/... (use direct image link)"
                />
                <Camera size={18} className="absolute left-3 top-3.5 text-text-muted" />
              </div>
            </div>
            <p className="text-xs text-text-muted mt-1 italic">Tip: Right-click a Pinterest image and select 'Copy image address'.</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">External Link (Pinterest/Details)</label>
            <div className="relative">
              <input 
                type="text" 
                name="externalLink"
                value={formData.externalLink}
                onChange={handleInputChange}
                className="w-full p-3 pl-10 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="https://pinterest.com/pin/..."
              />
              <FileText size={18} className="absolute left-3 top-3.5 text-text-muted" />
            </div>
            <p className="text-xs text-text-muted mt-1">If provided, the image will link to this URL.</p>
          </div>
          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="isAvailable"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium">Item is available for ordering</label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1" 
              isLoading={isSaving}
              disabled={isSaving}
            >
              {isEditing ? 'Save Changes' : 'Create Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMenuPage;
