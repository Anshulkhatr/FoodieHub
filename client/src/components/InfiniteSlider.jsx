import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronRight } from 'lucide-react';

/**
 * @param {Array} items - List of menu items to display
 * @param {String} title - Row title
 * @param {String} subtitle - Small text description
 * @param {Boolean} reverse - Scroll direction
 * @param {String} aspectRatio - CSS aspect-ratio (e.g., 'aspect-video' or 'aspect-square')
 * @param {String} icon - React component for the section icon
 * @param {String} speed - CSS duration (e.g., '40s' or '60s')
 */
const InfiniteSlider = ({ 
  items = [], 
  title = "Slider", 
  subtitle = "Check these out", 
  reverse = false,
  aspectRatio = "aspect-video",
  icon: IconComponent = null,
  speed = "40s"
}) => {
  if (items.length === 0) return null;

  // Always animate if we have items
  const showAnimation = items.length > 0;
  
  // Calculate how many times to repeat items to ensure the loop is seamless for small lists
  // We want at least 8 items for a smooth visual experience at the durations we use
  const repeatCount = items.length === 0 ? 0 : Math.ceil(8 / items.length);
  const sliderItems = Array(Math.max(2, repeatCount)).fill(items).flat();

  return (
    <div className="relative w-full overflow-hidden py-10 mb-10 bg-gradient-to-b from-primary/5 to-transparent">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {IconComponent && (
            <div className="p-2 bg-primary/10 rounded-xl">
               <IconComponent className="text-primary" size={18} />
            </div>
          )}
          <div>
            <h2 className="text-xl font-heading font-black text-text-primary tracking-tight">{title}</h2>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest leading-none mt-1">{subtitle}</p>
          </div>
        </div>
        <Link 
          to="/menu" 
          className="relative z-50 pointer-events-auto text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary-dark hover:scale-105 flex items-center gap-2 transition-all active:scale-95"
        >
          Explore All <ChevronRight size={14} className="animate-pulse" />
        </Link>
      </div>

      <div className={`flex overflow-hidden group ${!showAnimation ? 'justify-center' : ''}`}>
        <div 
          className={`flex gap-6 px-4 ${showAnimation ? (reverse ? 'animate-infinite-scroll-reverse' : 'animate-infinite-scroll') : ''} pause-on-hover min-w-max`}
          style={{ animationDuration: speed }}
        >
          {sliderItems.map((item, index) => (
            <Link 
              key={`${item._id}-${index}`}
              to={`/menu/${item._id}`}
              className={`flex-shrink-0 w-64 md:w-80 group/card`}
            >
              <div className={`relative ${aspectRatio} rounded-[2rem] overflow-hidden shadow-lg transition-all duration-500 group-hover/card:shadow-2xl group-hover/card:-translate-y-2 border border-border/50`}>
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
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </div>
  );
};

export default InfiniteSlider;
