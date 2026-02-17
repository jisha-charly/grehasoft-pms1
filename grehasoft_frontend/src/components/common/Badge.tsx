import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  pill?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', pill = false, className = '' }) => (
  <span className={`badge ${pill ? 'rounded-pill' : ''} bg-${variant} ${className} text-uppercase fw-bold`} style={{ fontSize: '0.7rem' }}>
    {label}
  </span>
);