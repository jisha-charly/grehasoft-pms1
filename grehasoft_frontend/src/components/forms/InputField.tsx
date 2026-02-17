import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const InputField: React.FC<Props> = ({ label, error, helperText, className = '', ...props }) => (
  <div className="mb-3">
    <label className="form-label xsmall fw-bold text-muted text-uppercase">{label}</label>
    <input 
      className={`form-control ${error ? 'is-invalid' : ''} ${className}`} 
      {...props} 
    />
    {error ? (
      <div className="invalid-feedback xsmall">{error}</div>
    ) : helperText ? (
      <div className="form-text xsmall">{helperText}</div>
    ) : null}
  </div>
);