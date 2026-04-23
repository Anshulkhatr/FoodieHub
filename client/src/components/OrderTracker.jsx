import React from 'react';
import { CheckCircle2, Clock, Truck, Utensils, PackageCheck } from 'lucide-react';

const OrderTracker = ({ status, statusHistory = [] }) => {
  const statuses = [
    { label: 'Placed', value: 'Pending', icon: Clock },
    { label: 'Preparing', value: 'Preparing', icon: Utensils },
    { label: 'Ready', value: 'Ready', icon: CheckCircle2 },
    { label: 'On the Way', value: 'Out for Delivery', icon: Truck },
    { label: 'Delivered', value: 'Delivered', icon: PackageCheck },
  ];

  const getStatusIndex = (val) => statuses.findIndex(s => s.value === val);
  const currentIndex = getStatusIndex(status);

  return (
    <div className="py-6">
      <div className="relative flex justify-between items-start">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-10"></div>
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000 -z-10"
          style={{ width: `${(currentIndex / (statuses.length - 1)) * 100}%` }}
        ></div>

        {statuses.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          // Try to find timestamp in statusHistory
          const historyEntry = statusHistory.find(h => h.status === step.value);
          const timestamp = historyEntry ? new Date(historyEntry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

          return (
            <div key={step.value} className="flex flex-col items-center gap-2 group">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500
                ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-surface border border-border text-text-muted'}
                ${isCurrent ? 'animate-pulse' : ''}
              `}>
                <Icon size={18} />
              </div>
              <div className="text-center space-y-0.5">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  {step.label}
                </p>
                {timestamp && (
                   <p className="text-[9px] text-text-muted font-mono">{timestamp}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTracker;
