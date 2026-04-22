import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Star, ChevronRight, Clock, Shield, Truck, Flame, ArrowDown, ChefHat, Leaf } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';
import InfiniteSlider from '../components/InfiniteSlider';
import CategoryMarquee from '../components/CategoryMarquee';
import HeroSlider from '../components/HeroSlider';

/* ── Floating food emoji particles ── */
const PARTICLES = ['🍕','🍔','🌮','🍜','🍣','🥗','🍰','🥩','🍤','🧁'];

const FloatingParticle = ({ emoji, style }) => (
  <span className="absolute select-none pointer-events-none animate-drift text-3xl opacity-20" style={style}>
    {emoji}
  </span>
);

/* ── Stat counter that animates up ── */
const Counter = ({ from, to, suffix }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = from;
        const step = Math.ceil((to - from) / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, to);
          setCount(start);
          if (start >= to) clearInterval(timer);
        }, 20);
        observer.disconnect();
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, from]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ── Menu card for featured items ── */
const FeaturedCard = ({ item, user }) => (
  <div className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 border border-orange-50">
    <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
      {item.image ? (
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-500">{item.emoji || '🍽️'}</div>
      )}
      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-500 font-bold px-3 py-1 rounded-full text-sm shadow">
        ₹{item.price?.toFixed(2)}
      </div>
      {item.isVeg && (
        <div className="absolute top-3 left-3 bg-green-500 text-white p-1.5 rounded-full shadow">
          <Leaf size={12} />
        </div>
      )}
    </div>
    <div className="p-5">
      <h3 className="font-bold text-gray-800 text-lg mb-1 truncate">{item.name}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{item.description || 'A delicious treat crafted with fresh ingredients.'}</p>
      <div className="flex gap-0.5 mb-4">
        {[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#f97316" stroke="none" />)}
      </div>
      <Link to={user ? "/menu" : "/login"} className="block w-full text-center bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white font-semibold py-2.5 rounded-2xl transition-all duration-300 shadow hover:shadow-lg text-sm">
        {user ? 'Order Now' : 'Login to Order'}
      </Link>
    </div>
  </div>
);

/* ── Main Page ── */
const LandingPage = () => {
  const { user } = useSelector(state => state.auth);
  const [menu, setMenu] = useState([]);
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      emoji: PARTICLES[i % PARTICLES.length],
      style: {
        left: `${Math.random() * 90}%`,
        top: `${Math.random() * 90}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${6 + Math.random() * 6}s`,
        fontSize: `${1.5 + Math.random() * 1.5}rem`,
      }
    }))
  );

  useEffect(() => {
    axiosInstance.get('/menu').then(({ data }) => setMenu(data)).catch(() => {});
  }, []);

  const featured = menu.slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ───── HERO SECTION ───── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        {/* Background circles */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-gradient-to-br from-orange-100 to-amber-100 rounded-full opacity-60 animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-gradient-to-tr from-amber-100 to-orange-50 rounded-full opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }} />

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center w-full pt-16">
          {/* Text */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold shadow-sm animate-fade-in-down">
              <Flame size={16} className="text-orange-500" />
              Fresh & Delivered Fast
            </div>
            <h1 className="text-5xl lg:text-7xl font-heading font-extrabold text-gray-900 leading-tight animate-fade-in-up">
              Taste the
              <span className="block bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                Extraordinary
              </span>
            </h1>
            <p className="text-gray-500 text-xl leading-relaxed max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Handcrafted dishes made with passion, delivered to your doorstep. Experience restaurant-quality food from the comfort of your home.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Link
                to={user ? '/menu' : '/register'}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-orange-200 transition-all duration-300 transform hover:scale-105 text-lg"
              >
                {user ? 'Explore Menu' : 'Get Started'}
                <ChevronRight size={20} />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 border-2 border-orange-200 text-orange-500 hover:bg-orange-50 font-bold px-8 py-4 rounded-2xl transition-all duration-300 text-lg"
              >
                Learn More
                <ArrowDown size={18} />
              </a>
            </div>
            {/* Quick stats */}
            <div className="flex gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              {[
                { label: 'Happy Customers', value: 1200, suffix: '+' },
                { label: 'Menu Items', value: menu.length > 0 ? menu.length : 50, suffix: '+' },
                { label: 'Avg. Rating', value: 4.9, suffix: '★' },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                    <Counter from={0} to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image slider */}
          <div className="relative flex justify-center animate-fade-in-right">
            <HeroSlider items={menu.slice(0, 5)} />
          </div>
        </div>
      </section>

      {/* High-Energy Category Marquee */}
      <CategoryMarquee />

      {/* ───── MULTIPLE SPOTLIGHT SLIDERS ───── */}
      <div className="mt-12 space-y-4 relative z-20">
        <InfiniteSlider 
          items={menu.filter(i => ['North Indian', 'South Indian', 'Biryani'].includes(i.category)).reverse().slice(0, 10)}
          title="Traditional Dinner"
          subtitle="Authentic flavors from across India"
          icon={ChefHat}
          speed="60s"
          aspectRatio="aspect-video"
        />
        
        <InfiniteSlider 
          items={menu.filter(i => ['Pizzas', 'Fast Food', 'Chinese'].includes(i.category)).slice(0, 10)}
          title="Quick Evening Bites"
          subtitle="Rapid service, massive flavor"
          icon={Flame}
          reverse={true}
          speed="50s"
          aspectRatio="aspect-square"
        />

        <InfiniteSlider 
          items={menu.filter(i => ['Desserts', 'Cakes', 'Beverages'].includes(i.category)).reverse().slice(0, 10)}
          title="After-Dinner Treats"
          subtitle="The perfect sweet finale"
          icon={Star}
          speed="45s"
          aspectRatio="aspect-[4/3]"
        />
      </div>

      {/* ───── HOW IT WORKS ───── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star size={14} fill="currentColor" />
              Simple & Fast
            </div>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 mb-4">How FoodieHub Works</h2>
            <p className="text-gray-400 text-xl max-w-xl mx-auto">From our kitchen to your table in just a few taps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: '🍽️', step: '01', title: 'Browse Our Menu', desc: 'Explore our wide range of gourmet dishes crafted with fresh, locally-sourced ingredients.' },
              { icon: '🛒', step: '02', title: 'Place Your Order', desc: 'Add your favorites to cart and checkout securely in seconds. No hassle, no stress.' },
              { icon: '🚀', step: '03', title: 'Fast Delivery', desc: 'Sit back and relax. Track your order live as we rush it straight to your door.' },
            ].map((step, i) => (
              <div key={i} className="relative group bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-500 border border-orange-100">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">{step.icon}</div>
                <div className="text-7xl font-black text-orange-100/80 absolute top-4 right-6 select-none">{step.step}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    {/* ───── FEATURED MENU slider ───── */}
    {featured.length > 0 && (
      <section id="menu" className="py-12 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-gray-900">Chef's Gourmet Picks</h2>
        </div>
        
        <InfiniteSlider 
          items={featured} 
          title="Handpicked Featured Gallery"
          subtitle="A handpicked selection of our most celebrated dishes"
          icon={Star}
          aspectRatio="aspect-[4/3]"
          speed="50s"
        />
      </section>
    )}

      {/* ───── 2-COLUMN VISUAL FEATURE SECTION ───── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left image stack */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden aspect-square shadow-xl bg-gradient-to-br from-orange-100 to-amber-100">
                  <img src="/burger.png" alt="Gourmet Burger" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center text-7xl">🍔</div>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-amber-400 to-orange-400 p-6 text-white shadow-xl">
                  <div className="text-3xl font-black">100%</div>
                  <div className="text-sm opacity-90 mt-1">Fresh Ingredients</div>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-white shadow-xl">
                  <div className="text-3xl mb-2">⚡</div>
                  <div className="font-bold text-lg">Lightning Fast</div>
                  <div className="text-sm opacity-90 mt-1">30 min delivery</div>
                </div>
                <div className="rounded-3xl overflow-hidden aspect-square shadow-xl bg-gradient-to-br from-amber-50 to-orange-50">
                  <img src="/pasta.png" alt="Gourmet Pasta" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center text-7xl">🍝</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
              <Leaf size={14} />
              Why Choose Us
            </div>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold text-gray-900 leading-tight">
              Food Made With<br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">Love & Care</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Every dish at FoodieHub is crafted by our passionate chefs using the finest locally-sourced ingredients. We believe food should not just fill your stomach — it should nourish your soul.
            </p>
            <div className="space-y-5">
              {[
                { icon: <Shield size={20} className="text-orange-400" />, title: 'Hygiene Guaranteed', desc: 'Every meal is prepared in a clean, certified kitchen environment.' },
                { icon: <Truck size={20} className="text-amber-500" />, title: 'Real-Time Tracking', desc: 'Watch your order travel from our kitchen to your door, live.' },
                { icon: <ChefHat size={20} className="text-orange-500" />, title: 'Expert Chefs', desc: 'Our culinary team brings years of fine-dining experience to every plate.' },
              ].map((f, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="bg-orange-50 group-hover:bg-orange-100 p-3 rounded-2xl shrink-0 transition-colors">{f.icon}</div>
                  <div>
                    <div className="font-bold text-gray-800">{f.title}</div>
                    <div className="text-gray-400 text-sm mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to={user ? '/menu' : '/login'} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-amber-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-orange-200 transition-all duration-300 transform hover:scale-105">
              {user ? 'Order Now' : 'Sign In to Order'}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,#f97316,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,#f59e0b,transparent_50%)]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Star size={14} fill="currentColor" />
              Customer Reviews
            </div>
            <h2 className="text-4xl lg:text-5xl font-heading font-extrabold">What Our Customers Say</h2>
          </div>
          <div className="flex overflow-hidden group">
            <div className="flex animate-infinite-scroll pause-on-hover gap-8 py-4 min-w-max">
              {[...Array(2)].flatMap(() => [
                { name: 'Priya S.', review: 'Absolutely amazing food! The pasta was perfectly cooked and arrived still hot. Will definitely order again!', rating: 5 },
                { name: 'Rahul M.', review: 'Best burgers in the city, hands down. The quality is consistently excellent and delivery is super fast.', rating: 5 },
                { name: 'Anjali K.', review: 'Finally a food app that delivers what they promise. Fresh, delicious and on time. FoodieHub is my go-to!', rating: 5 },
                { name: 'Vikram R.', review: 'The biryani here is authentic and brings back memories of home. Excellent service!', rating: 5 },
                { name: 'Sneha P.', review: 'Quick delivery and the packaging was spill-proof. Very impressed with the attention to detail.', rating: 4 },
              ]).map((t, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                  <div className="flex gap-1 mb-4">
                    {Array(t.rating).fill(0).map((_, s) => <Star key={s} size={16} fill="#f97316" stroke="none" />)}
                  </div>
                  <p className="text-gray-200 leading-relaxed mb-6 italic">"{t.review}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center font-bold text-white shadow-lg">
                      {t.name[0]}
                    </div>
                    <div className="font-semibold text-white">{t.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA SECTION ───── */}
      <section className="py-24 bg-gradient-to-r from-orange-400 to-amber-500 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {['🍕','🍔','🍣','🍜','🧁'].map((e, i) => (
            <span key={i} className="absolute text-4xl opacity-10 animate-float" style={{
              left: `${10 + i * 20}%`, top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.8}s`, animationDuration: '5s'
            }}>{e}</span>
          ))}
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-6xl font-heading font-extrabold text-white mb-6 leading-tight">
            Ready to Taste<br />Something Amazing?
          </h2>
          <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of food lovers who trust FoodieHub for their daily meals. Sign up now and get your first order experience.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to={user ? '/menu' : '/register'} className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg">
              {user ? 'Order Now' : 'Create Free Account'}
              <ChevronRight size={20} />
            </Link>
            {!user && (
              <Link to="/login" className="inline-flex items-center gap-2 border-2 border-white text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-heading font-extrabold text-orange-400">FoodieHub</span>
          </div>
          <p className="text-sm text-center">© 2026 FoodieHub. Crafted with ❤️ for food lovers.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/login" className="hover:text-orange-400 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-orange-400 transition-colors">Register</Link>
            <Link to="/orders/mine" className="hover:text-orange-400 transition-colors">My Orders</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
