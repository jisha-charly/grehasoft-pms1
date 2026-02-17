import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Department } from "../../types/auth";

interface Props {
  departments: Department[];
  children: React.ReactNode;
}

const DeptGuard: React.FC<Props> = ({ departments, children }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (!departments.includes(user.department)) {
    return null;
  }

  return <>{children}</>;
};

export default DeptGuard;
