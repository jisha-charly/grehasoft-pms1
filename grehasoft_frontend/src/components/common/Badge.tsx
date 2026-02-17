import React from "react";

interface Props {
  label: string;
  variant?: string;
}

const Badge: React.FC<Props> = ({ label, variant = "secondary" }) => {
  return (
    <span className={`badge bg-${variant}`}>
      {label}
    </span>
  );
};

export default Badge;
