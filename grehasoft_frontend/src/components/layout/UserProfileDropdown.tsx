import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const UserProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
      >
        {user?.first_name} {user?.last_name}
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        <li>
          <button className="dropdown-item" onClick={() => navigate("/profile")}>
            Profile
          </button>
        </li>
        <li><hr className="dropdown-divider" /></li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserProfileDropdown;
