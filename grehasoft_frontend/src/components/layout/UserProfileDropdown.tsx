import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { PATHS } from '../../routes/paths';

const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dropdown">
      <button className="btn border-0 d-flex align-items-center gap-2" data-bs-toggle="dropdown">
        <div className="bg-primary-subtle text-primary rounded-circle small fw-bold d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
          {user?.first_name[0]}{user?.last_name[0]}
        </div>
        <div className="text-start d-none d-md-block">
          <div className="small fw-bold lh-1">{user?.full_name}</div>
          <div className="xsmall text-muted">{user?.role_name}</div>
        </div>
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
        <li><Link className="dropdown-item small" to={PATHS.PROFILE}>My Profile</Link></li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item small text-danger fw-bold" onClick={logout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfileDropdown;