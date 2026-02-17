import React from 'react';
import UserProfileDropdown from './UserProfileDropdown';

interface Props {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Topbar: React.FC<Props> = ({ onToggleSidebar }) => {
  return (
    <header className="topbar d-flex align-items-center justify-content-between px-4">
      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light btn-sm rounded-circle" onClick={onToggleSidebar}>
          <i className="bi bi-list fs-5"></i>
        </button>
        <div className="input-group input-group-sm d-none d-lg-flex" style={{ width: '300px' }}>
          <span className="input-group-text bg-light border-0"><i className="bi bi-search"></i></span>
          <input type="text" className="form-control bg-light border-0" placeholder="Global Search..." />
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <button className="btn btn-light btn-sm rounded-circle position-relative">
          <i className="bi bi-bell"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
        </button>
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;