import React from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../cart/cartSlice';
import Button from '../../components/Button';
import { Plus, ExternalLink } from 'lucide-react';

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItem({ menuItem: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
  };

  return (
    <div className="bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col group">
      <div className="relative h-48 sm:h-56 overflow-hidden bg-background group/img">
        {item.externalLink ? (
          <a 
            href={item.externalLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <img 
              src={item.image || 'https://placehold.co/600x400?text=No+Image+Available'} 
              alt={item.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg transform translate-y-4 group-hover/img:translate-y-0 transition-transform">
                <ExternalLink size={20} className="text-primary" />
              </div>
            </div>
          </a>
        ) : (
          <img 
            src={item.image || 'https://placehold.co/600x400?text=No+Image+Available'} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm z-10">
          <span className="font-heading font-bold text-primary">${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-bold text-lg text-text-primary leading-tight">{item.name}</h3>
        </div>
        <p className="text-text-muted text-sm flex-grow line-clamp-2">{item.desc}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs bg-background border border-border text-text-muted px-2 py-1 rounded-md max-w-[100px] truncate">{item.category}</span>
          <Button variant="primary" onClick={handleAddToCart} className="p-2 aspect-square rounded-full flex items-center justify-center">
            <Plus size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
