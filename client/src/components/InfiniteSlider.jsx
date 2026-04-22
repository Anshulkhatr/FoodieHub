import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Flame, Star, ChevronRight } from 'lucide-react';

const InfiniteSlider = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axiosInstance.get('/menu');
        // Select top items or items with originalPrice (deals)
        const featured = data.slice(0, 10); 
        setItems(featured);
      } catch (error) {
        console.error('Failed to fetch slider items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (isLoading || items.length === 0) return null;

  // Double the items for seamless infinite scroll
  const sliderItems = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-12 mb-12 bg-gradient-to-b from-primary/5 to-transparent">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl">
             <Flame className="text-primary animate-pulse" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-heading font-black text-text-primary tracking-tight">Today's <span className="text-primary">Spotlight</span></h2>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">Handpicked favorites just for you</p>
          </div>
        </div>
        <Link to="/menu" className="text-xs font-black uppercase tracking-widest text-primary hover:gap-2 flex items-center gap-1 transition-all">
          Explore All <ChevronRight size={14} />
        </Link>
      </div>

      <div className="flex overflow-hidden group">
        <div className="flex animate-infinite-scroll pause-on-hover gap-6 px-4">
          {sliderItems.map((item, index) => (
            <Link 
              key={`${item._id}-${index}`}
              to={`/menu/${item._id}`}
              className="flex-shrink-0 w-64 md:w-80 group/card"
            >
              <div className="relative h-48 md:h-56 rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:-translate-y-2 border border-border/50">
                {/* Image */}
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity" />

                {/* Deal Badge */}
                {item.originalPrice && (
                  <div className="absolute top-4 left-4 glass-morphism px-3 py-1 rounded-full shadow-sm animate-bounce-slow">
                    <span className="text-[10px] font-black text-primary uppercase">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 glass-morphism px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Star size={10} fill="#f59e0b" className="text-amber-500" />
                  <span className="text-[10px] font-black text-text-primary">4.9</span>
                </div>

                {/* Content */}
                <div className="absolute bottom-5 left-6 right-6 text-white translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-light mb-1">{item.category}</p>
                  <h3 className="text-lg md:text-xl font-bold leading-tight mb-1 truncate">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                       <span className="text-lg font-black">₹{item.price}</span>
                       {item.originalPrice && (
                         <span className="text-xs text-white/50 line-through">₹{item.originalPrice}</span>
                       )}
                    </div>
                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </div>
  );
};

export default InfiniteSlider;
