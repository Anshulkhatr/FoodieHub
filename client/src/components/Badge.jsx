import React from 'react';

const Badge = ({ status }) => {
  const statusStyles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Preparing: 'bg-blue-50 text-blue-700 border-blue-200',
    Ready: 'bg-green-50 text-green-700 border-green-200',
    Delivered: 'bg-gray-100 text-gray-500 border-gray-200',
  };

  const style = statusStyles[status] || statusStyles.Pending;

  return (
    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${style}`}>
      {status}
    </span>
  );
};

export default Badge;
