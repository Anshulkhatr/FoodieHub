import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from '../cart/cartSlice';
import Button from '../../components/Button';
import { Plus, ExternalLink } from 'lucide-react';

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItem({ menuItem: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
  };

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Clickable image → detail page */}
      <Link to={`/menu/${item._id}`} className="block relative h-48 sm:h-56 overflow-hidden bg-background">
        {item.externalLink ? (
          <a
            href={item.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={item.image || 'https://placehold.co/600x400?text=No+Image+Available'}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <ExternalLink size={20} className="text-primary" />
              </div>
            </div>
          </a>
        ) : (
          <>
            <img
              src={item.image || 'https://placehold.co/600x400?text=No+Image+Available'}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-semibold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                View Details
              </span>
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {/* Veg/Non-Veg Badge */}
          <div className={`px-2 py-1 rounded-lg backdrop-blur-md border shadow-sm flex items-center gap-1.5 ${item.isVeg ? 'bg-green-500/10 border-green-500/20 text-green-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.isVeg ? 'Veg' : 'Non-Veg'}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
          {item.originalPrice > item.price && (
            <div className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-lg shadow-primary/20 animate-fade-in flex items-center gap-1">
              <span className="animate-pulse">🏷️</span> {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
            </div>
          )}
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-border/50 flex flex-col items-end">
            <span className="font-heading font-bold text-primary leading-none">₹{(item.price || 0).toFixed(2)}</span>
            {item.originalPrice > item.price && (
              <span className="text-[10px] text-text-muted line-through opacity-70">₹{item.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/menu/${item._id}`} className="hover:text-primary transition-colors">
            <h3 className="font-heading font-bold text-lg text-text-primary leading-tight">{item.name}</h3>
          </Link>
        </div>
        <p className="text-text-muted text-sm flex-grow line-clamp-2">{item.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs bg-background border border-border text-text-muted px-2 py-1 rounded-md max-w-[100px] truncate">
            {item.category}
          </span>
          <Button variant="primary" onClick={handleAddToCart} className="p-2 aspect-square rounded-full flex items-center justify-center">
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;

