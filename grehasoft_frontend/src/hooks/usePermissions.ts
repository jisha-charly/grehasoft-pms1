import { useAuth } from "./useAuth";
import { UserRole, Department } from "../types/auth";

export const usePermissions = () => {
  const { user } = useAuth();

  const can = (role: UserRole) => {
    return user?.role === role;
  };

  const canAny = (roles: UserRole[]) => {
    return roles.includes(user?.role as UserRole);
  };

  const isDepartment = (dept: Department) => {
    return user?.department === dept;
  };

  const isAdmin = () => {
    return user?.role === "SUPER_ADMIN";
  };

  return {
    user,
    can,
    canAny,
    isDepartment,
    isAdmin,
  };
};
