import React, { useState, useEffect } from 'react';
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
import AdminRevenuePage from './pages/AdminRevenuePage';
import MyOrdersPage from './pages/MyOrdersPage';
import LandingPage from './pages/LandingPage';
import MenuItemDetailPage from './pages/MenuItemDetailPage';

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
    return matchesCategory && matchesSearch;
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
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors text-xs font-bold">✕</button>
          )}
        </div>
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
        <div className="text-center py-20 bg-surface rounded-3xl border border-border animate-fade-in-up">
          <div className="text-5xl mb-4">🥡</div>
          <h3 className="text-xl font-bold text-text-primary mb-2">Nothing found</h3>
          <p className="text-text-muted text-sm">Try a different category or search term.</p>
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
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-background text-text-primary font-sans flex flex-col relative overflow-hidden">
        <Navbar toggleCart={() => setIsCartOpen(true)} />
        <main className="flex-1 w-full relative z-10 pt-24 md:pt-28">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><MenuPage /></div>} />
            <Route path="/menu/:id" element={<MenuItemDetailPage />} />
            <Route path="/login" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><LoginPage /></div>} />
            <Route path="/register" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><RegisterPage /></div>} />
            <Route path="/orders/mine" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute><MyOrdersPage /></ProtectedRoute></div>} />
            <Route path="/admin/dashboard" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></div>} />
            <Route path="/admin/orders" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminOrdersPage /></ProtectedRoute></div>} />
            <Route path="/admin/revenue" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminRevenuePage /></ProtectedRoute></div>} />
            <Route path="/admin/menu" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><ProtectedRoute adminOnly><AdminMenuPage /></ProtectedRoute></div>} />
            <Route path="*" element={<div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8"><NotFoundPage /></div>} />
          </Routes>
        </main>
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
