import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut, Search, X, Menu as MenuIcon } from 'lucide-react';
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
    <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full mb-4' : 'hidden md:block w-64 lg:w-80'}`}>
      <div className={`flex items-center gap-2 bg-background border rounded-xl px-3 py-2 w-full
                        transition-all duration-300 ${open ? 'border-primary shadow-md shadow-primary/10' : 'border-border'}`}>
        <Search size={15} className={`flex-shrink-0 transition-colors ${open ? 'text-primary' : 'text-text-muted'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search food…"
          className="bg-transparent outline-none text-sm text-text-primary placeholder-text-muted w-full"
        />
        {query && (
          <button onClick={clearSearch} className="text-text-muted hover:text-primary transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-surface border border-border rounded-2xl shadow-2xl
                        shadow-black/20 overflow-hidden z-[100] animate-fade-in-down">
          {loading ? (
             <div className="px-4 py-5 text-center text-text-muted text-sm flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-5 text-center text-text-muted text-sm">
              <div className="text-2xl mb-1">🍽️</div>
              No items found for "<span className="text-text-primary font-medium">{query}</span>"
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-border">
              {results.map(item => (
                <li key={item._id}>
                  <button onClick={() => handleSelect(item._id)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors text-left group">
                    <img src={item.image || 'https://placehold.co/48x48?text=🍴'} alt={item.name} className="w-11 h-11 rounded-xl object-cover flex-shrink-0 border border-border group-hover:scale-105 transition-transform duration-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm font-semibold truncate group-hover:text-primary transition-colors">{item.name}</p>
                      <p className="text-text-muted text-xs truncate">{item.category}</p>
                    </div>
                    <span className="text-primary font-bold text-sm flex-shrink-0">₹{(item.price || 0).toFixed(0)}</span>
                  </button>
                </li>
              ))}
            </ul>
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

  // Close mobile menu on route change
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
    <nav className="sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="flex items-center justify-between py-4 px-4 sm:px-6 w-full">
        {/* Left Section: Logo & Search */}
        <div className="flex items-center gap-6 flex-1 min-w-0">
          {/* Logo */}
          <Link to="/" className="text-2xl sm:text-3xl font-heading font-bold text-primary flex items-center gap-2 flex-shrink-0">
            <span>FoodieHub</span>
          </Link>

          {/* Search — Desktop */}
          <div className="hidden md:flex flex-1 max-w-sm">
            {user && <NavSearchBar isMobile={false} />}
          </div>
        </div>

        {/* Desktop & Mobile Right Nav */}
        <div className="flex-shrink-0 flex items-center justify-end gap-2">
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-text-muted hover:text-primary font-medium transition-colors whitespace-nowrap">Admin</Link>
                )}
                <Link to="/menu" className="text-text-muted hover:text-primary font-medium transition-colors whitespace-nowrap">Menu</Link>
                <Link to="/orders/mine" className="text-text-muted hover:text-primary font-medium transition-colors whitespace-nowrap">My Orders</Link>
                <button onClick={toggleCart} className="relative p-2 text-text-primary hover:text-primary transition-colors">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm border-2 border-surface">{cartCount}</span>
                  )}
                </button>
                <div className="flex items-center gap-2 text-text-muted border-l pl-3 lg:pl-4 border-border ml-1 lg:ml-2">
                  <div className="bg-primary/10 text-primary p-2 rounded-full hidden lg:flex"><UserIcon size={18} /></div>
                  <span className="text-sm font-medium mr-1 lg:mr-2 max-w-[80px] lg:max-w-[100px] truncate" title={user.name}>{user.name}</span>
                  <button title="Logout" onClick={handleLogout} className="hover:text-red-500 transition-colors p-2 bg-surface hover:bg-red-50 rounded-full border border-transparent hover:border-red-100 flex-shrink-0"><LogOut size={16} /></button>
                </div>
              </>
            ) : (
               <div className="flex items-center gap-3">
                <Link to="/login"><Button variant="ghost">Log In</Button></Link>
                <Link to="/register"><Button variant="primary">Sign Up</Button></Link>
              </div>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-2">
            {user && (
              <button onClick={toggleCart} className="relative p-2 text-text-primary hover:text-primary transition-colors">
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-text-primary hover:bg-background rounded-lg border border-transparent transition-colors">
               {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-surface border-t border-border animate-fade-in-down z-50">
           {user && <NavSearchBar isMobile={true} />}
           <div className="flex flex-col space-y-3 mt-2">
             {user ? (
               <>
                 {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="px-4 py-2 hover:bg-primary/5 rounded-lg text-text-primary font-medium">Admin Panel</Link>
                 )}
                 <Link to="/menu" className="px-4 py-2 hover:bg-primary/5 rounded-lg text-text-primary font-medium">Menu</Link>
                 <Link to="/orders/mine" className="px-4 py-2 hover:bg-primary/5 rounded-lg text-text-primary font-medium">My Orders</Link>
                 
                 <div className="h-px bg-border my-2" />
                 
                 <div className="flex flex-row justify-between items-center px-4 py-2">
                   <div className="flex items-center gap-2">
                    <div className="bg-primary/10 text-primary p-2 rounded-full"><UserIcon size={16} /></div>
                    <span className="text-sm font-medium">{user.name}</span>
                   </div>
                   <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors">
                     <LogOut size={16} />
                     Logout
                   </button>
                 </div>
               </>
             ) : (
               <div className="grid grid-cols-2 gap-3 mt-4">
                 <Link to="/login"><Button variant="ghost" className="w-full">Log In</Button></Link>
                 <Link to="/register"><Button variant="primary" className="w-full">Sign Up</Button></Link>
               </div>
             )}
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

