import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'link' | 'outline-primary';
  size?: 'sm' | 'lg';
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, loading, variant = 'primary', size, icon, className = '', disabled, ...props 
}) => (
  <button 
    className={`btn btn-${variant} ${size ? `btn-${size}` : ''} ${className} d-inline-flex align-items-center justify-content-center`}
    disabled={loading || disabled}
    {...props}
  >
    {loading ? (
      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
    ) : icon ? (
      <i className={`bi ${icon} me-2`}></i>
    ) : null}
    {children}
  </button>
);