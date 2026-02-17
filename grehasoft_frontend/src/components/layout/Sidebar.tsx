import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import SidebarItem from "./SidebarItem";

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h5 className="mb-4 fw-bold">Grehasoft PMS</h5>

      <ul className="nav flex-column">

        <SidebarItem to="/" icon="bi-speedometer2" label="Dashboard" />

        {user?.department === "digital_marketing" && (
          <SidebarItem to="/crm/leads" icon="bi-people" label="Leads" />
        )}

        {user?.department === "software" && (
          <>
            <SidebarItem to="/pms/projects" icon="bi-kanban" label="Projects" />
            <SidebarItem to="/pms/my-tasks" icon="bi-list-task" label="My Tasks" />
          </>
        )}

        {user?.role === "SUPER_ADMIN" && (
          <>
            <hr className="text-secondary" />
            <SidebarItem to="/admin/users" icon="bi-person-gear" label="Users" />
            <SidebarItem to="/admin/activity" icon="bi-clock-history" label="Audit Logs" />
          </>
        )}

      </ul>
    </div>
  );
};

export default Sidebar;
