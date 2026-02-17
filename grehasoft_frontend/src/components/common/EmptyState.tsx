import React from "react";

interface Props {
  message: string;
}

const EmptyState: React.FC<Props> = ({ message }) => {
  return (
    <div className="text-center py-5 text-muted">
      <i className="bi bi-inbox fs-1 d-block mb-3"></i>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
