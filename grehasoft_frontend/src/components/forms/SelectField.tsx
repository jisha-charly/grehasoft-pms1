import React from "react";

interface Option {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`form-select ${error ? "is-invalid" : ""}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default SelectField;
