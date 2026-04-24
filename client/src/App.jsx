import React, { useState, useEffect } from 'react';
import { Flame, Leaf, ChevronDown } from 'lucide-react';
import axiosInstance from './utils/axiosInstance';
import Spinner from './components/Spinner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import CartDrawer from './features/cart/CartDrawer';
import MenuItemCard from './features/menu/MenuItemCard';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminMenuPage from './pages/AdminMenuPage';
import AdminEditMenuItemPage from './pages/AdminEditMenuItemPage';
import AdminRevenuePage from './pages/AdminRevenuePage';
import MyOrdersPage from './pages/MyOrdersPage';
import RewardsDashboard from './pages/RewardsDashboard';
import LandingPage from './pages/LandingPage';
import MenuItemDetailPage from './pages/MenuItemDetailPage';
import InfiniteSlider from './components/InfiniteSlider';
import CartPage from './pages/CartPage';

const CATEGORY_META = {
  'All':          { emoji: '🍽️', label: 'All Items' },
  'North Indian': { emoji: '🫓', label: 'North Indian' },
  'South Indian': { emoji: '🥘', label: 'South Indian' },
  'Biryani':      { emoji: '🍚', label: 'Biryani' },
  'Pizzas':       { emoji: '🍕', label: 'Pizzas' },
  'Chinese':      { emoji: '🥢', label: 'Chinese' },
  'Fast Food':    { emoji: '🍔', label: 'Fast Food' },
  'Cakes':        { emoji: '🎂', label: 'Cakes' },
  'Desserts':     { emoji: '🍮', label: 'Desserts' },
  'Beverages':    { emoji: '🥤', label: 'Beverages' },
  'Starters':     { emoji: '🥗', label: 'Starters' },
  'Mains':        { emoji: '🍛', label: 'Mains' },
  'Burgers':      { emoji: '🍔', label: 'Burgers' },
  'Pasta':        { emoji: '🍝', label: 'Pasta' },
  'Breads':       { emoji: '🫓', label: 'Breads' },
  'Sides':        { emoji: '🥗', label: 'Sides' },
  'Drinks':       { emoji: '🍹', label: 'Drinks' },
};

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    isVeg: null,
    priceRange: [0, 5000],
    maxTime: 60
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data } = await axiosInstance.get('/menu');
        setMenu(data);
      } catch (error) {
        console.error('Failed to fetch menu:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const categories = ['All', ...Object.keys(
    menu.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  )];

  const filteredMenu = menu.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.desc.toLowerCase().includes(search.toLowerCase());
    const matchesVeg = filters.isVeg === null || item.isVeg === filters.isVeg;
    const matchesPrice = item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1];
    
    return matchesCategory && matchesSearch && matchesVeg && matchesPrice;
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <Spinner size={48} />
      <p className="text-text-muted text-sm font-bold uppercase tracking-widest animate-pulse">Loading Menu…</p>
    </div>
  );

  return (
    <div className="py-8">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <span>🍽️</span> Our Full Menu
        </div>
        <h1 className="text-4xl md:text-6xl font-heading font-black text-text-primary mb-4 tracking-tight">
          Culinary <span className="text-primary">Masterworks</span>
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Explore {menu.length}+ dishes crafted with passion, premium ingredients, and generations of culinary heritage.
        </p>
      </div>

      {/* Recommended Spotlight Slider */}
      <div className="mt-8 mb-4">
        <InfiniteSlider 
          items={menu.filter(i => i.originalPrice).slice(0, 10)} 
          title="Culinary Spotlight"
          subtitle="Handpicked favorites with the best deals"
          icon={Flame}
        />
      </div>

      {/* Search Bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search any dish, ingredient or category…"
            className="w-full pl-11 pr-4 py-3.5 bg-surface border border-border rounded-2xl outline-none text-sm font-medium placeholder:text-text-muted/50 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {/* Advanced Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
        {/* Veg/Non-Veg Toggle */}
        <div className="flex bg-surface border border-border p-1 rounded-2xl shadow-sm">
          <button 
            onClick={() => setFilters(prev => ({ ...prev, isVeg: null }))}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.isVeg === null ? 'bg-text-primary text-white shadow-md' : 'text-text-muted hover:text-text-primary'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilters(prev => ({ ...prev, isVeg: true }))}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filters.isVeg === true ? 'bg-green-600 text-white shadow-md' : 'text-text-muted hover:text-green-600'}`}
          >
            <div className={`w-2 h-2 rounded-full ${filters.isVeg === true ? 'bg-white' : 'bg-green-500'}`} />
            Veg
          </button>
          <button 
            onClick={() => setFilters(prev => ({ ...prev, isVeg: false }))}
            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${filters.isVeg === false ? 'bg-red-600 text-white shadow-md' : 'text-text-muted hover:text-red-600'}`}
          >
            <div className={`w-2 h-2 rounded-full ${filters.isVeg === false ? 'bg-white' : 'bg-red-500'}`} />
            Non-Veg
          </button>
        </div>

        {/* Price Dropdown */}
        <div className="group relative flex items-center gap-3 bg-surface border border-border pl-5 pr-3 py-2 rounded-2xl shadow-sm hover:border-primary/50 transition-all">
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Price Under</span>
          <div className="relative">
            <select 
              value={filters.priceRange[1]} 
              onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, Number(e.target.value)] }))}
              className="appearance-none bg-transparent pr-8 py-1 text-xs font-black text-primary outline-none cursor-pointer relative z-10"
            >
              <option value="500">₹500</option>
              <option value="1000">₹1,000</option>
              <option value="2500">₹2,500</option>
              <option value="5000">₹5,000</option>
            </select>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary group-hover:translate-y-[-40%] transition-transform">
                <ChevronDown size={14} strokeWidth={3} />
            </div>
          </div>
        </div>
        
        {/* Reset Filters */}
        {(filters.isVeg !== null || filters.priceRange[1] < 5000 || search) && (
            <button 
                onClick={() => {
                    setFilters({ isVeg: null, priceRange: [0, 5000], maxTime: 60 });
                    setSearch('');
                    setActiveCategory('All');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline px-2"
            >
                Clear Filters
            </button>
        )}
      </div>

      {/* Category Nav Pills */}
      <div className="sticky top-[72px] z-30 bg-background/80 backdrop-blur-xl py-4 mb-8 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/50">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory">
          {categories.map(cat => {
            const meta = CATEGORY_META[cat] || { emoji: '🍴', label: cat };
            const count = cat === 'All' ? menu.length : menu.filter(i => i.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearch(''); }}
                className={`flex-shrink-0 snap-start flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                    : 'bg-surface text-text-muted border-border hover:border-primary/30 hover:text-text-primary hover:bg-primary/5'
                }`}
              >
                <span className={`text-base leading-none ${isActive ? '' : 'grayscale'}`}>{meta.emoji}</span>
                <span>{meta.label}</span>
                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-background text-text-muted border border-border'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Category Label */}
      {activeCategory !== 'All' && !search && (
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{(CATEGORY_META[activeCategory] || {}).emoji || '🍴'}</span>
            <div>
              <h2 className="text-2xl font-heading font-black text-text-primary">{activeCategory}</h2>
              <p className="text-xs text-text-muted font-bold uppercase tracking-widest">{filteredMenu.length} dishes available</p>
            </div>
          </div>
          <button
            onClick={() => setActiveCategory('All')}
            className="text-xs font-black uppercase tracking-widest text-primary hover:underline"
          >
            View All →
          </button>
        </div>
      )}

      {search && (
        <div className="mb-6 animate-fade-in-up">
          <p className="text-sm text-text-muted font-bold">
            {filteredMenu.length} result{filteredMenu.length !== 1 ? 's' : ''} for "<span className="text-text-primary">{search}</span>"
          </p>
        </div>
      )}

      {/* Results Grid */}
      {filteredMenu.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-[2.5rem] border border-border animate-fade-in-up shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          <div className="relative z-10">
            <div className="text-6xl mb-6">🥡</div>
            <h3 className="text-2xl font-heading font-black text-text-primary mb-2 tracking-tight">Nothing found</h3>
            <p className="text-text-muted text-sm max-w-xs mx-auto mb-8 font-medium">We couldn't find any items matching your current filters. Try relaxing them!</p>
            <button 
                onClick={() => {
                    setFilters({ isVeg: null, priceRange: [0, 5000], maxTime: 60 });
                    setSearch('');
                    setActiveCategory('All');
                }}
                className="px-8 py-3 bg-text-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all transform active:scale-95 shadow-xl shadow-black/10"
            >
                Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMenu.map((item, i) => (
            <div key={item._id} className="animate-fade-in-up" style={{ animationDelay: `${(i % 12) * 40}ms` }}>
              <MenuItemCard item={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NotFoundPage = () => (
  <div className="text-center py-24 px-4 bg-surface rounded-3xl border border-border mt-10 shadow-lg animate-in fade-in zoom-in duration-500">
    <div className="text-8xl mb-6">🏜️</div>
    <h2 className="text-4xl font-heading font-bold text-text-primary mb-4">Are You Lost?</h2>
    <p className="text-text-muted text-lg max-w-md mx-auto mb-8">The page you're searching for has vanished into thin air. Let's get you back to safety.</p>
    <a href="/" className="inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all transform hover:scale-105 shadow-md">
      Return Home
    </a>
  </div>
);

function App() {

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col relative overflow-hidden">
        <Navbar />
        <main className="flex-1 w-full relative z-10 pt-24 md:pt-28">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><MenuPage /></div>} />
            <Route path="/menu/:id" element={<MenuItemDetailPage />} />
            <Route path="/login" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><LoginPage /></div>} />
            <Route path="/register" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><RegisterPage /></div>} />
            <Route path="/orders/mine" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute><MyOrdersPage /></ProtectedRoute></div>} />
            <Route path="/rewards" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute><RewardsDashboard /></ProtectedRoute></div>} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin/dashboard" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></div>} />
            <Route path="/admin/orders" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute></div>} />
            <Route path="/admin/revenue" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminRevenuePage /></ProtectedRoute></div>} />
            <Route path="/admin/menu" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminMenuPage /></ProtectedRoute></div>} />
            <Route path="/admin/menu/add" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminEditMenuItemPage /></ProtectedRoute></div>} />
            <Route path="/admin/menu/edit/:id" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminEditMenuItemPage /></ProtectedRoute></div>} />
            <Route path="*" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><NotFoundPage /></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
