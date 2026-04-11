import React from 'react';

const StatusDropdown = ({ currentStatus, onStatusChange, isLoading }) => {
  const statuses = ['Pending', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];

  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      disabled={isLoading}
      className="bg-surface border border-border text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2 text-text-primary disabled:opacity-50"
    >
      {statuses.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
};

export default StatusDropdown;
