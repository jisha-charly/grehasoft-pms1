import React from "react";
import { NavLink } from "react-router-dom";

interface Props {
  to: string;
  label: string;
  icon: string;
}

const SidebarItem: React.FC<Props> = ({ to, label, icon }) => {
  return (
    <li className="nav-item mb-2">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `nav-link text-white d-flex align-items-center ${
            isActive ? "bg-primary rounded" : ""
          }`
        }
      >
        <i className={`bi ${icon} me-2`}></i>
        {label}
      </NavLink>
    </li>
  );
};

export default SidebarItem;
