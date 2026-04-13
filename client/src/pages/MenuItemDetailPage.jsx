import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { addItem } from '../features/cart/cartSlice';
import Spinner from '../components/Spinner';
import {
  ArrowLeft, ShoppingCart, Star, Tag, CheckCircle,
  XCircle, ExternalLink, ChevronRight, Clock, Flame, Leaf
} from 'lucide-react';

/* ─── tiny helpers ─────────────────────────────────────── */
const Badge = ({ children, color = 'default' }) => {
  const colors = {
    default: 'bg-surface border border-border text-text-muted',
    green:   'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400',
    red:     'bg-red-500/15 border border-red-500/30 text-red-400',
    amber:   'bg-amber-500/15 border border-amber-500/30 text-amber-400',
    primary: 'bg-primary/15 border border-primary/30 text-primary',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
};

/* ─── related card (compact) ───────────────────────────── */
const RelatedCard = ({ item }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.items);
  const inCart = cartItems.some(c => c.menuItem === item._id);

  return (
    <Link
      to={`/menu/${item._id}`}
      className="group flex-shrink-0 w-48 sm:w-56 bg-surface border border-border rounded-2xl overflow-hidden
                 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
    >
      <div className="h-32 overflow-hidden relative">
        <img
          src={item.image || 'https://placehold.co/400x300?text=No+Image'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
          ₹{(item.price || 0).toFixed(0)}
        </div>
      </div>
      <div className="p-3">
        <p className="font-semibold text-text-primary text-sm leading-tight line-clamp-1">{item.name}</p>
        <p className="text-text-muted text-xs mt-1 line-clamp-2">{item.desc}</p>
        <button
          onClick={e => {
            e.preventDefault();
            dispatch(addItem({ menuItem: item._id, name: item.name, price: item.price, quantity: 1, image: item.image }));
          }}
          className={`mt-2 w-full text-xs font-semibold py-1.5 rounded-lg transition-all duration-200
            ${inCart
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95'}`}
        >
          {inCart ? '✓ Added' : '+ Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

/* ─── main page ────────────────────────────────────────── */
const MenuItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(s => s.cart.items);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const inCart = data ? cartItems.some(c => c.menuItem === data.item._id) : false;

  useEffect(() => {
    setLoading(true);
    setImgLoaded(false);
    setAdded(false);
    setQty(1);
    axiosInstance.get(`/menu/${id}`)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!data) return;
    dispatch(addItem({
      menuItem: data.item._id,
      name: data.item.name,
      price: data.item.price,
      quantity: qty,
      image: data.item.image,
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size={48} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-7xl">🍽️</div>
        <h2 className="text-2xl font-bold text-text-primary">Item not found</h2>
        <p className="text-text-muted">This dish may have been removed from our menu.</p>
        <button onClick={() => navigate('/menu')}
          className="mt-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all">
          Back to Menu
        </button>
      </div>
    );
  }

  const { item, related } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">

      {/* ── Back button ── */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-sm font-medium">Back</span>
      </button>

      {/* ── Hero card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">

        {/* Image */}
        <div className="relative rounded-3xl overflow-hidden bg-surface border border-border shadow-2xl
                        shadow-black/20 group aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-surface">
              <Spinner size={36} />
            </div>
          )}
          <img
            src={item.image || 'https://placehold.co/800x600?text=No+Image'}
            alt={item.name}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700
              group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* price badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white
                          font-heading font-bold text-xl px-4 py-2 rounded-2xl shadow-lg">
            ₹{(item.price || 0).toFixed(2)}
          </div>
          {/* availability */}
          <div className="absolute top-4 left-4">
            {item.isAvailable
              ? <Badge color="green"><CheckCircle size={12} /> Available</Badge>
              : <Badge color="red"><XCircle size={12} /> Unavailable</Badge>}
          </div>
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Details panel */}
        <div className="flex flex-col justify-between gap-6">

          {/* Top: name + badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="primary"><Tag size={12} /> {item.category}</Badge>
              <Badge color="amber"><Flame size={12} /> Popular Pick</Badge>
              {item.isAvailable && <Badge color="green"><Clock size={12} /> Ready to Order</Badge>}
            </div>
            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-text-primary leading-tight mb-4">
              {item.name}
            </h1>
            <p className="text-text-muted text-lg leading-relaxed">{item.desc}</p>
          </div>

          {/* Rating mock */}
          <div className="flex items-center gap-3 py-4 border-y border-border">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={18}
                  className={i <= 4 ? 'fill-amber-400 text-amber-400' : 'text-border fill-border'} />
              ))}
            </div>
            <span className="text-text-muted text-sm">4.0 · <span className="text-text-primary font-semibold">Highly Rated</span></span>
          </div>

          {/* Price + qty + cart */}
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-text-muted text-sm mb-1">Price per item</p>
                <p className="text-5xl font-heading font-black text-primary">₹{(item.price || 0).toFixed(2)}</p>
              </div>
              {/* Qty stepper */}
              <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-2">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full bg-background border border-border text-text-primary
                             font-bold text-lg flex items-center justify-center hover:border-primary
                             hover:text-primary transition-all active:scale-90"
                >−</button>
                <span className="w-6 text-center font-bold text-text-primary text-lg">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-full bg-primary text-white font-bold text-lg
                             flex items-center justify-center hover:bg-primary/90 transition-all active:scale-90"
                >+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3
                transition-all duration-300 active:scale-95 shadow-lg
                ${!item.isAvailable
                  ? 'bg-surface border border-border text-text-muted cursor-not-allowed'
                  : added
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/30 hover:shadow-primary/50'}`}
            >
              {!item.isAvailable ? (
                <><XCircle size={22} /> Currently Unavailable</>
              ) : added ? (
                <><CheckCircle size={22} className="animate-bounce" /> Added to Cart! ({qty})</>
              ) : (
                <><ShoppingCart size={22} /> Add {qty > 1 ? `${qty}×` : ''} to Cart · ₹{(item.price * qty).toFixed(2)}</>
              )}
            </button>

            {/* External link */}
            {item.externalLink && (
              <a href={item.externalLink} target="_blank" rel="noopener noreferrer"
                className="mt-3 w-full py-3 rounded-2xl border border-border text-text-muted
                           hover:border-primary hover:text-primary transition-all flex items-center
                           justify-center gap-2 text-sm font-semibold">
                <ExternalLink size={16} /> View More Details
              </a>
            )}
          </div>

          {/* Info chips */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <Leaf size={16} />, label: 'Fresh Ingredients', sub: 'Sourced daily' },
              { icon: <Clock size={16} />, label: 'Prep Time', sub: '15-20 minutes' },
            ].map((chip, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                  {chip.icon}
                </div>
                <div>
                  <p className="text-text-primary text-xs font-semibold">{chip.label}</p>
                  <p className="text-text-muted text-xs">{chip.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related items ── */}
      {related && related.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-text-primary">
                More from <span className="text-primary">{item.category}</span>
              </h2>
              <p className="text-text-muted text-sm mt-1">You might also like these</p>
            </div>
            <Link to="/menu" className="flex items-center gap-1 text-primary text-sm font-semibold
                                         hover:gap-2 transition-all duration-200">
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {/* Horizontal scroll on mobile, wrapped grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory
                          scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent
                          sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {related.map(r => (
              <div key={r._id} className="snap-start">
                <RelatedCard item={r} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemDetailPage;
