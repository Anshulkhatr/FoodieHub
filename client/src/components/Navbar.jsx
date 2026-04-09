import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { logout } from '../features/auth/authSlice';
import Button from './Button';

const Navbar = ({ toggleCart }) => {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border py-4 px-6 flex items-center justify-between shadow-sm">
      <Link to="/" className="text-3xl font-heading font-bold text-primary flex items-center gap-2">
        <span>FoodieHub</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin/dashboard" className="text-text-muted hover:text-primary font-medium transition-colors">
                Admin Panel
              </Link>
            )}
            <Link to="/orders/mine" className="text-text-muted hover:text-primary font-medium transition-colors">
              My Orders
            </Link>
            <button onClick={toggleCart} className="relative p-2 text-text-primary hover:text-primary transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm border-2 border-surface">
                  {cartCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2 text-text-muted border-l pl-4 border-border">
              <div className="bg-primary/10 text-primary p-2 rounded-full">
                <UserIcon size={18} />
              </div>
              <span className="text-sm font-medium mr-2 max-w-[100px] truncate" title={user.name}>{user.name}</span>
              <button title="Logout" onClick={handleLogout} className="hover:text-red-500 transition-colors p-2 bg-surface hover:bg-red-50 rounded-full border border-transparent hover:border-red-100">
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/register">
              <Button variant="primary">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
