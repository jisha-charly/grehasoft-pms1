import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserRole } from "../../types/auth";

interface Props {
  roles: UserRole[];
  children: React.ReactNode;
}

const RoleGuard: React.FC<Props> = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (!roles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
};

export default RoleGuard;
