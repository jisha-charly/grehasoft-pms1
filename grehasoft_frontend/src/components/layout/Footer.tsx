import React from 'react';

const Footer: React.FC = () => (
  <footer className="mt-5 py-4 border-top">
    <div className="d-flex justify-content-between align-items-center text-muted xsmall">
      <div>&copy; {new Date().getFullYear()} Grehasoft PMS v1.0.4</div>
      <div className="d-flex gap-3">
        <span>Security Verified</span>
        <span>Internal Use Only</span>
      </div>
    </div>
  </footer>
);

export default Footer;