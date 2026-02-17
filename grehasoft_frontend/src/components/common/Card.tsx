import React from "react";

interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<Props> = ({ title, children, className = "" }) => {
  return (
    <div className={`card shadow-sm border-0 ${className}`}>
      {title && (
        <div className="card-header bg-white fw-bold">{title}</div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
