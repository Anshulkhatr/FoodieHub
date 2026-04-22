import React from 'react';

const CATEGORIES = [
  { name: "North Indian", emoji: "🍛", color: "bg-orange-500" },
  { name: "Pizzas", emoji: "🍕", color: "bg-red-500" },
  { name: "Burgers", emoji: "🍔", color: "bg-yellow-600" },
  { name: "Chinese", emoji: "🥢", color: "bg-red-600" },
  { name: "Biryani", emoji: "🍚", color: "bg-amber-600" },
  { name: "South Indian", emoji: "🥘", color: "bg-green-600" },
  { name: "Desserts", emoji: "🧁", color: "bg-pink-500" },
  { name: "Beverages", emoji: "🍹", color: "bg-blue-500" },
  { name: "Starters", emoji: "🥗", color: "bg-emerald-500" },
  { name: "Cakes", emoji: "🎂", color: "bg-purple-500" },
];

const CategoryMarquee = () => {
  // Double the categories to match the -50% translateX loop animation
  const items = [...CATEGORIES, ...CATEGORIES];

  return (
    <div className="w-full bg-gray-900 py-3 overflow-hidden border-y border-white/5 relative z-30">
      <div className="flex animate-marquee-fast items-center whitespace-nowrap min-w-max">
        {items.map((cat, i) => (
          <div key={i} className="flex items-center gap-4 px-10 group cursor-default">
            <span className={`w-2 h-2 rounded-full ${cat.color} group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
            <span className="text-white text-sm font-black uppercase tracking-[0.3em] group-hover:text-primary transition-colors">{cat.name}</span>
            <span className="text-2xl grayscale group-hover:grayscale-0 transition-all group-hover:scale-125 transform-gpu">{cat.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryMarquee;
