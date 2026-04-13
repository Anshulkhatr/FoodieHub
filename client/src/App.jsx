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

const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={40} /></div>;

  return (
    <div className="py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-text-primary mb-4">Our Menu</h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">Explore our culinary masterworks made with passion and fresh ingredients.</p>
      </div>
      {menu.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          <p className="text-xl">Our kitchen is preparing something special. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map(item => (
            <MenuItemCard key={item._id} item={item} />
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
        <main className="flex-1 w-full relative z-10 overflow-y-auto">
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
