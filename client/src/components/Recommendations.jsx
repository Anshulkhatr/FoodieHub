import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import Spinner from './Spinner';
import { Sparkles, ChevronRight, Star } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const { data } = await axiosInstance.get('/menu/recommendations');
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <div className="flex justify-center p-10"><Spinner size={32} /></div>;
  if (recommendations.length === 0) return null;

  return (
    <div className="py-10 space-y-6">
      <div className="flex items-center justify-between px-4 sm:px-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-xl text-primary animate-pulse">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-black text-text-primary">Curated For You</h2>
            <p className="text-xs font-black text-text-muted uppercase tracking-widest">AI-Powered Gastronomy</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
          Explore All <ChevronRight size={14} />
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-6 px-4 sm:px-0 scrollbar-hide snap-x">
        {recommendations.map((item) => (
          <div 
            key={item._id} 
            className="flex-shrink-0 w-72 group relative bg-surface border border-border rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 snap-start"
          >
            <div className="relative h-44 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-3 right-3">
                <div className="bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter text-primary shadow-sm border border-primary/10 flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> {item.category}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                 <button className="w-full py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    Add to Cart
                 </button>
              </div>
            </div>
            <div className="p-5 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-text-primary text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{item.name}</h3>
                <span className="font-heading font-black text-primary">₹{item.price}</span>
              </div>
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                {item.desc || "Experience the finest flavors crafted by our master chefs."}
              </p>
              {item.popularityScore > 0 && (
                <div className="pt-2 flex items-center gap-2">
                  <div className="h-1 flex-1 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${Math.min(item.popularityScore * 5, 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] font-black uppercase text-text-muted">Popularity</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
