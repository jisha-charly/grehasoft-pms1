import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/auth';

interface Props {
  to: string;
  label: string;
  icon: string;
  allowedRoles?: UserRole[];
}

export const SidebarItem: React.FC<Props> = ({ to, label, icon, allowedRoles }) => {
  const { user } = useAuth();

  // RBAC: If allowedRoles is defined, check if user has permission
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
    >
      <i className={`bi ${icon}`}></i>
      <span>{label}</span>
    </NavLink>
  );
};