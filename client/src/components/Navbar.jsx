import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, Search, X, Menu as MenuIcon, ChevronDown, Package, LayoutDashboard, Sparkles } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import axiosInstance from '../utils/axiosInstance';
import Button from './Button';

/* ─── Search Bar Component ───────────────────────────────── */
const NavSearchBar = ({ isMobile }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/menu');
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const handleSelect = (id) => {
    setQuery('');
    setResults([]);
    setOpen(false);
    navigate(`/menu/${id}`);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full mb-4 px-2' : 'hidden md:block w-full'}`}>
      <div className={`flex items-center gap-3 bg-background border rounded-2xl px-4 py-2.5 w-full
                        transition-all duration-500 ${open ? 'border-primary ring-4 ring-primary/5 shadow-xl shadow-primary/5' : 'border-border'}`}>
        <Search size={16} className={`flex-shrink-0 transition-colors duration-500 ${open ? 'text-primary' : 'text-text-muted/60'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search for your next favorite dish…"
          className="bg-transparent outline-none text-xs font-medium text-text-primary placeholder-text-muted/50 w-full"
        />
        {query && (
          <button onClick={clearSearch} className="text-text-muted hover:text-primary transition-colors flex-shrink-0 p-1">
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-3 w-full bg-surface/95 backdrop-blur-xl border border-border rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                        overflow-hidden z-[100] animate-fade-in-up">
          {loading ? (
             <div className="px-6 py-8 text-center text-text-muted text-xs flex flex-col items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Searching the pantry…
            </div>
          ) : results.length === 0 ? (
            <div className="px-6 py-8 text-center text-text-muted text-xs">
              <div className="text-3xl mb-2 grayscale opacity-50">🍱</div>
              No dishes found for "<span className="text-text-primary font-bold">{query}</span>"
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-text-muted/60">Top Results</div>
              <ul className="divide-y divide-border/50">
                {results.map(item => (
                  <li key={item._id}>
                    <button onClick={() => handleSelect(item._id)} className="w-full flex items-center gap-4 px-5 py-4 hover:bg-primary/5 transition-all text-left group">
                      <div className="relative flex-shrink-0">
                        <img src={item.image || 'https://placehold.co/100x100?text=🍽️'} alt={item.name} className="w-12 h-12 rounded-2xl object-cover border border-border/50 shadow-sm group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm font-bold truncate group-hover:text-primary transition-colors">{item.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black uppercase tracking-tighter text-text-muted/60 bg-background px-1.5 py-0.5 rounded border border-border/50">{item.category}</span>
                            <span className="text-xs text-text-muted truncate line-clamp-1">{item.desc}</span>
                        </div>
                      </div>
                      <span className="text-primary font-black text-sm flex-shrink-0 ml-2">₹{item.price?.toFixed(0)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Navbar ─────────────────────────────────────────────── */
const Navbar = ({ toggleCart }) => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-border/50 py-3 shadow-lg' : 'bg-surface/40 backdrop-blur-sm border-b border-transparent py-5'
    }`}>
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-6 sm:px-8 lg:px-12 w-full gap-4">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-5 min-w-0">
          <Link to="/" className="group flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                <Utensils size={20} />
            </div>
            <span className="text-2xl font-heading font-black text-text-primary tracking-tighter flex items-center">
                Foodie<span className="text-primary group-hover:translate-x-0.5 transition-transform duration-300">Hub</span>
            </span>
          </Link>

          {/* Search — Desktop */}
          <div className="hidden md:flex w-48 lg:w-64">
            {user && <NavSearchBar isMobile={false} />}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/menu" className={`text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/menu' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}>Collection</Link>
            {user && (
                <Link to="/rewards" className={`text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/rewards' ? 'text-primary' : 'text-text-muted hover:text-text-primary'} flex items-center gap-1.5`}>
                    <Sparkles size={12} className="text-primary animate-pulse" /> Rewards
                </Link>
            )}
            {user && (
                <Link to="/orders/mine" className={`text-xs font-black uppercase tracking-widest transition-all ${location.pathname === '/orders/mine' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}>History</Link>
            )}
            {user?.role === 'admin' && (
                <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-text-primary hover:text-primary transition-all group">
                    <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" />
                    Console
                </Link>
            )}
          </div>

          <div className="h-4 w-px bg-border/50 hidden md:block"></div>

          <div className="flex items-center gap-3">
              {user && (
                <button 
                    onClick={toggleCart} 
                    className="relative p-2.5 text-text-primary hover:text-primary bg-background/50 hover:bg-white border border-border/50 hover:border-primary/20 rounded-2xl transition-all group active:scale-95 shadow-sm"
                >
                  <ShoppingCart size={22} className="group-hover:rotate-3" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[9px] font-black w-5 h-5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-surface animate-bounce-slow">{cartCount}</span>
                  )}
                </button>
              )}

              {user ? (
                  <div className="hidden sm:flex items-center gap-3 bg-surface p-1 rounded-2xl border border-border shadow-sm group">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/10 to-orange-400/10 flex items-center justify-center font-black text-primary text-xs uppercase border border-primary/20">
                          {user.name?.[0] || 'U'}
                      </div>
                      <div className="max-w-[120px] truncate hidden md:block">
                          <div className="flex items-center gap-1.5">
                              <p className="text-[10px] font-black uppercase tracking-tighter text-text-primary leading-none">{user.name}</p>
                              <div className="bg-primary/10 px-1.5 py-0.5 rounded-lg border border-primary/20 flex items-center gap-1">
                                  <Sparkles size={8} className="text-primary" />
                                  <span className="text-[8px] font-black text-primary">{user.loyaltyPoints || 0}</span>
                              </div>
                          </div>
                          <p className="text-[8px] font-bold text-text-muted leading-tight mt-0.5 truncate capitalize">{user.role}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="p-2 text-text-muted hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ml-1"
                        title="Sign Out"
                      >
                          <LogOut size={16} />
                      </button>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                      <Link to="/login" className="text-xs font-black uppercase tracking-widest px-4 py-2 hover:text-primary transition-colors">Login</Link>
                      <Link to="/register" className="hidden sm:block">
                          <Button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl">Join</Button>
                      </Link>
                  </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2.5 md:hidden text-text-primary bg-background/50 border border-border/50 rounded-2xl"
              >
                  {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-surface/95 backdrop-blur-2xl border-b border-border overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="p-6 space-y-6">
            {user && <NavSearchBar isMobile={true} />}
            <div className="flex flex-col gap-4">
                <Link to="/menu" className="flex items-center justify-between group">
                    <span className="text-sm font-black uppercase tracking-widest text-text-primary">Our Collection</span>
                    <Package size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                {user && (
                    <Link to="/rewards" className="flex items-center justify-between group">
                        <span className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                            <Sparkles size={16} /> FoodieRewards
                        </span>
                        <ChevronDown size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -rotate-90" />
                    </Link>
                )}
                {user && (
                    <Link to="/orders/mine" className="flex items-center justify-between group">
                        <span className="text-sm font-black uppercase tracking-widest text-text-primary">My History</span>
                        <ChevronDown size={18} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity -rotate-90" />
                    </Link>
                )}
                {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="flex items-center justify-between group">
                        <span className="text-sm font-black uppercase tracking-widest text-primary">Admin Console</span>
                        <LayoutDashboard size={18} className="text-primary" />
                    </Link>
                )}
                <div className="h-px bg-border/50"></div>
                {user ? (
                   <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                                {user.name?.[0]}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-text-primary">{user.name}</p>
                                <p className="text-[10px] font-black uppercase text-text-muted">{user.role}</p>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="p-3 bg-red-50 text-red-500 rounded-2xl border border-red-100">
                            <LogOut size={18} />
                        </button>
                   </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/login" className="w-full text-center py-4 bg-background border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest">Sign In</Link>
                        <Link to="/register" className="w-full text-center py-4 bg-text-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10">Register</Link>
                    </div>
                )}
            </div>
          </div>
      </div>
    </nav>
  );
};

const Utensils = ({ size, className }) => (
    <svg 
        width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}
    >
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
        <path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
);

export default Navbar;

