import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
}

export const SelectField: React.FC<Props> = ({ label, options, error, ...props }) => (
  <div className="mb-3">
    <label className="form-label xsmall fw-bold text-muted text-uppercase">{label}</label>
    <select className={`form-select ${error ? 'is-invalid' : ''}`} {...props}>
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <div className="invalid-feedback xsmall">{error}</div>}
  </div>
);