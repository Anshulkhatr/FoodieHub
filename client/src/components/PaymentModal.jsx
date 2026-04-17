import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Wallet, CheckCircle2, Loader2, ChevronRight, Shield, Lock } from 'lucide-react';

/* ─── UPI App Options ─── */
const UPI_APPS = [
  { id: 'gpay', name: 'Google Pay', logo: '🟢', color: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
  { id: 'phonepe', name: 'PhonePe', logo: '🟣', color: 'from-purple-50 to-purple-100', border: 'border-purple-200' },
  { id: 'paytm', name: 'Paytm', logo: '🔵', color: 'from-sky-50 to-sky-100', border: 'border-sky-200' },
  { id: 'bhim', name: 'BHIM UPI', logo: '🇮🇳', color: 'from-orange-50 to-orange-100', border: 'border-orange-200' },
];

const PAYMENT_METHODS = [
  { id: 'upi',  icon: <Smartphone size={20} />,  label: 'UPI / QR Code',    desc: 'GPay, PhonePe, Paytm & more' },
  { id: 'card', icon: <CreditCard size={20} />,  label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { id: 'nb',   icon: <Building2 size={20} />,   label: 'Net Banking',       desc: 'All major banks supported' },
  { id: 'cod',  icon: <Wallet size={20} />,       label: 'Cash on Delivery',  desc: 'Pay when your food arrives' },
];

/* ─── Simulated Payment Processing Screen ─── */
const ProcessingScreen = ({ method, total, onDone }) => {
  const [step, setStep] = useState(0);
  const steps = ['Connecting to payment gateway…', 'Verifying transaction…', 'Confirming your order…'];

  React.useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setStep(i + 1), (i + 1) * 900)
    );
    const done = setTimeout(onDone, steps.length * 900 + 600);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center gap-6 animate-fade-in-up">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
          <Loader2 size={48} className="text-primary animate-spin" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Lock size={14} className="text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-heading font-black text-text-primary mb-1">Processing Payment</h3>
        <p className="text-text-muted text-sm font-bold">₹{total.toFixed(2)} via {method}</p>
      </div>
      <div className="w-full max-w-[260px] space-y-3">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 text-xs font-bold transition-all duration-700 ${step > i ? 'text-success opacity-100' : 'text-text-muted/40 opacity-40'}`}>
            {step > i ? <CheckCircle2 size={16} className="text-success flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-current flex-shrink-0" />}
            {s}
          </div>
        ))}
      </div>
      <p className="text-[10px] text-text-muted/50 font-bold uppercase tracking-widest flex items-center gap-1.5">
        <Shield size={10} /> 256-bit SSL Encrypted
      </p>
    </div>
  );
};

/* ─── Success Screen ─── */
const SuccessScreen = ({ total, method }) => (
  <div className="flex flex-col items-center justify-center h-full px-8 py-16 text-center gap-5 animate-fade-in-up">
    <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center border-4 border-green-100 shadow-xl">
      <CheckCircle2 size={60} className="text-green-500" />
    </div>
    <div>
      <h3 className="text-2xl font-heading font-black text-text-primary mb-1">Payment Successful!</h3>
      <p className="text-text-muted text-sm">₹{total.toFixed(2)} paid via {method}</p>
    </div>
    <div className="w-full bg-green-50 rounded-2xl p-4 border border-green-100 space-y-2">
      <p className="text-xs font-black uppercase tracking-widest text-green-600">Order Confirmed 🎉</p>
      <p className="text-sm text-text-muted">Your delicious food is being prepared by our chefs. You'll receive updates in My Orders.</p>
    </div>
  </div>
);

/* ─── Main Payment Modal ─── */
const PaymentModal = ({ isOpen, onClose, total, onConfirm }) => {
  const [method, setMethod] = useState('upi');
  const [upiApp, setUpiApp] = useState('');
  const [upiId, setUpiId] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [bank, setBank] = useState('');
  const [stage, setStage] = useState('select'); // 'select' | 'processing' | 'success'

  if (!isOpen) return null;

  const methodLabel = PAYMENT_METHODS.find(m => m.id === method)?.label || method;

  const handlePay = () => {
    setStage('processing');
  };

  const handleProcessingDone = () => {
    setStage('success');
    setTimeout(() => {
      onConfirm();
      onClose();
      setStage('select');
    }, 1800);
  };

  const formatCard = (val) => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
  };

  const isPayable = () => {
    if (method === 'cod') return true;
    if (method === 'upi') return upiApp || upiId.includes('@');
    if (method === 'card') return cardNo.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3;
    if (method === 'nb') return !!bank;
    return false;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]" onClick={onClose} />

      {/* Modal Wrapper for Perfect Centering */}
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
        {/* Modal */}
        <div className="w-full max-w-[500px] max-h-[100%] sm:max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-y-auto custom-scrollbar animate-fade-in-up pointer-events-auto flex flex-col">

        {stage === 'processing' && (
          <ProcessingScreen method={methodLabel} total={total} onDone={handleProcessingDone} />
        )}
        {stage === 'success' && <SuccessScreen total={total} method={methodLabel} />}

        {stage === 'select' && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 pt-6 pb-4 border-b border-border/50 flex justify-between items-start z-10">
              <div>
                <h2 className="text-2xl font-heading font-black text-text-primary tracking-tight">Secure Checkout</h2>
                <p className="text-text-muted text-sm font-bold mt-0.5">Amount Due: <span className="text-primary font-black text-base">₹{total.toFixed(2)}</span></p>
              </div>
              <button onClick={onClose} className="p-2.5 hover:bg-background rounded-2xl border border-border/50 transition-all">
                <X size={20} className="text-text-muted" />
              </button>
            </div>

            {/* Payment Method Tabs */}
            <div className="px-6 pt-5 space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-2">Choose Payment Method</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all text-left ${
                      method === m.id
                        ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                        : 'border-border bg-surface hover:border-primary/30 hover:bg-primary/5'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${method === m.id ? 'bg-primary text-white' : 'bg-background text-text-muted'}`}>
                      {m.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-text-primary">{m.label}</p>
                      <p className="text-xs text-text-muted font-bold">{m.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${method === m.id ? 'border-primary' : 'border-border'}`}>
                      {method === m.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Method-specific fields */}
            <div className="px-6 py-5">
              {/* UPI */}
              {method === 'upi' && (
                <div className="space-y-4 animate-fade-in-up">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Pay via UPI App</p>
                  <div className="grid grid-cols-4 gap-2">
                    {UPI_APPS.map(app => (
                      <button
                        key={app.id}
                        onClick={() => setUpiApp(app.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all bg-gradient-to-br ${app.color} ${app.border} ${upiApp === app.id ? 'ring-2 ring-primary shadow-md' : 'hover:opacity-80'}`}
                      >
                        <span className="text-2xl">{app.logo}</span>
                        <span className="text-[9px] font-black uppercase text-text-muted leading-tight text-center">{app.name}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-[10px] font-black uppercase text-text-muted">or enter UPI ID</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={e => { setUpiId(e.target.value); setUpiApp(''); }}
                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-text-muted/50"
                  />
                </div>
              )}

              {/* Card */}
              {method === 'card' && (
                <div className="space-y-3 animate-fade-in-up">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Card Details</p>
                  <input
                    type="text"
                    placeholder="Card Number"
                    value={cardNo}
                    onChange={e => setCardNo(formatCard(e.target.value))}
                    maxLength={19}
                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-text-muted/50 tracking-widest"
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-text-muted/50"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={e => setExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      className="px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-text-muted/50"
                    />
                    <input
                      type="password"
                      placeholder="CVV"
                      value={cvv}
                      onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0,3))}
                      maxLength={3}
                      className="px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-text-muted/50 tracking-widest"
                    />
                  </div>
                </div>
              )}

              {/* Net Banking */}
              {method === 'nb' && (
                <div className="space-y-3 animate-fade-in-up">
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Select Your Bank</p>
                  <select
                    value={bank}
                    onChange={e => setBank(e.target.value)}
                    className="w-full px-4 py-3.5 bg-surface border border-border rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all appearance-none"
                  >
                    <option value="">-- Select Bank --</option>
                    {['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* COD */}
              {method === 'cod' && (
                <div className="space-y-3 animate-fade-in-up bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <div className="text-3xl">💵</div>
                  <p className="text-sm font-bold text-text-primary">Pay in cash when your order arrives at your doorstep.</p>
                  <p className="text-xs text-text-muted font-bold">Please keep exact change ready: <span className="text-primary font-black">₹{total.toFixed(2)}</span></p>
                </div>
              )}
            </div>

            {/* Sticky Pay Button */}
            <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-6 pt-3 pb-8 sm:pb-6 border-t border-border/50 space-y-3">
              <button
                disabled={!isPayable()}
                onClick={handlePay}
                className="w-full h-16 bg-text-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Lock size={16} />
                {method === 'cod' ? `Place Order · ₹${total.toFixed(2)}` : `Pay Securely · ₹${total.toFixed(2)}`}
                <ChevronRight size={16} />
              </button>
              <p className="text-center text-[9px] font-bold text-text-muted/50 uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Shield size={9} /> Secured by 256-bit SSL Encryption
              </p>
            </div>
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default PaymentModal;
