import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        {label} {required && <span className="text-danger">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-control ${error ? "is-invalid" : ""}`}
      />

      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

export default InputField;
