import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, footer, headerActions, className = '' }) => (
  <div className={`card border-0 shadow-sm ${className}`}>
    {(title || headerActions) && (
      <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
        <div>
          {title && <h6 className="card-title mb-0 fw-bold">{title}</h6>}
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        {headerActions && <div>{headerActions}</div>}
      </div>
    )}
    <div className="card-body">{children}</div>
    {footer && <div className="card-footer bg-white border-top-0 py-3">{footer}</div>}
  </div>
);