import React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: string;
}

const Button: React.FC<Props> = ({
  children,
  loading = false,
  variant = "primary",
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`btn btn-${variant} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading && (
        <span className="spinner-border spinner-border-sm me-2"></span>
      )}
      {children}
    </button>
  );
};

export default Button;
