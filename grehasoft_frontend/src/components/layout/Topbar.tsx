import React from "react";
import { useAuth } from "../../hooks/useAuth";
import UserProfileDropdown from "./UserProfileDropdown";

const Topbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="d-flex justify-content-between align-items-center bg-white border-bottom px-4 py-2 shadow-sm">
      <h6 className="mb-0 fw-bold">
        {user?.department?.replace("_", " ").toUpperCase()} Dashboard
      </h6>

      <UserProfileDropdown />
    </div>
  );
};

export default Topbar;
