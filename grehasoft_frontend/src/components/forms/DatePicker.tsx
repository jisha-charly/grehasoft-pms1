import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const DatePicker: React.FC<Props> = ({ label, error, ...props }) => (
  <div className="mb-3">
    <label className="form-label xsmall fw-bold text-muted text-uppercase">{label}</label>
    <input type="date" className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
    {error && <div className="invalid-feedback xsmall">{error}</div>}
  </div>
);