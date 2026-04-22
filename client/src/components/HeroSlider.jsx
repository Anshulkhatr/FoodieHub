import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Clock } from 'lucide-react';

const HeroSlider = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const displayItems = items.length > 0 ? items.slice(0, 5) : [
    { name: "Gourmet Experience", image: "/hero_food.png", price: 299, category: "Premium" }
  ];

  useEffect(() => {
    if (displayItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayItems.length]);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % displayItems.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + displayItems.length) % displayItems.length);

  return (
    <div className="relative w-full max-w-lg group">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-amber-100 rounded-[2.5rem] rotate-3 scale-105 opacity-50 blur-sm transition-transform duration-700 group-hover:rotate-6" />
      
      {/* Main Image Container */}
      <div className="relative rounded-[2.5rem] shadow-2xl w-full aspect-square overflow-hidden bg-white">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 items-center justify-center text-8xl">🍽️</div>
            
            {/* Overlay Info */}
            <div className="absolute bottom-6 left-6 right-6">
               <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl translate-y-4 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="#f59e0b" className="text-amber-500" />
                      <span className="text-[10px] font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-800 truncate pr-2">{item.name}</h4>
                    <span className="text-orange-600 font-extrabold">₹{item.price}</span>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      {displayItems.length > 1 && (
        <>
          <button 
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-orange-500 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
          
          {/* Indicators */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {displayItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-orange-200 hover:bg-orange-300'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Floating Chips (Decorative) */}
      <div className="absolute -top-4 -left-6 bg-white shadow-xl rounded-2xl px-4 py-3 flex items-center gap-2 animate-drift z-20">
        <Star size={16} className="text-orange-400" fill="currentColor" />
        <span className="font-bold text-[10px] text-gray-700 uppercase tracking-tighter">Chef's Special</span>
      </div>
    </div>
  );
};

export default HeroSlider;
