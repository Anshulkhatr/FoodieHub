import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 font-sans font-medium rounded-full transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-text-muted hover:text-primary hover:bg-surface',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-surface text-text-primary border border-border hover:bg-secondary/5',
  };

  // Prevent passing non-standard props to DOM button
  const { isLoading: _, ...restProps } = props;

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...restProps}>
      {children}
    </button>
  );
};

export default Button;
