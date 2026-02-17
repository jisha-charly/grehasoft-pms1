import React from 'react';

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

export const TextArea: React.FC<Props> = ({ label, error, rows = 3, ...props }) => (
  <div className="mb-3">
    <label className="form-label xsmall fw-bold text-muted text-uppercase">{label}</label>
    <textarea className={`form-control ${error ? 'is-invalid' : ''}`} rows={rows} {...props} />
    {error && <div className="invalid-feedback xsmall">{error}</div>}
  </div>
);