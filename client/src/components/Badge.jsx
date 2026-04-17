import React from 'react';

const Badge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Preparing: 'bg-primary/10 text-primary border-primary/20 animate-pulse',
    Ready: 'bg-green-100 text-green-700 border-green-200',
    'Out for Delivery': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    Delivered: 'bg-text-muted/10 text-text-muted border-border',
  };

  const style = statusStyles[status] || statusStyles.Pending;

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-tighter rounded-full border shadow-sm ${style}`}>
        {status === 'Preparing' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1 animate-ping"></span>}
        {status}
      </span>
    </div>
  );
};

export default Badge;
