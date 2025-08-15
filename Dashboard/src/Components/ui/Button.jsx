import React from 'react';

export const Button = ({ children, variant = 'default', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500",
    destructive: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    outline: "bg-transparent border border-slate-300 hover:bg-slate-100 focus:ring-slate-500",
    ghost: "hover:bg-slate-100",
  };
  return <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};