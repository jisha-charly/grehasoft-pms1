import React from "react";

interface DatePickerProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default DatePicker;
