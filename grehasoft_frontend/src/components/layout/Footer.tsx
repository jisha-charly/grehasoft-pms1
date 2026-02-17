import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="text-center py-3 border-top bg-white">
      <small className="text-muted">
        © {new Date().getFullYear()} Grehasoft PMS • Internal Enterprise System
      </small>
    </div>
  );
};

export default Footer;
