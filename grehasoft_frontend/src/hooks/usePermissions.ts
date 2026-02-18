import { useAuth } from './useAuth';
import type{ UserRole } from '../types/auth';

/**
 * Custom hook to handle Role-Based Access Control (RBAC) logic in the UI.
 * Integrates with current user state from AuthContext.
 */
export const usePermissions = () => {
  const { user } = useAuth();

  // Helper: check if user has a specific role
  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  // Helper: check if user is in the same department as the resource
  const isSameDept = (resourceDeptId: number | undefined): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true; // Admins are department-agnostic
    return user.department?.id === resourceDeptId;
  };

  return {
    // Role shortcuts
    isAdmin: user?.role === 'SUPER_ADMIN',
    isPM: user?.role === 'PROJECT_MANAGER',
    isSales: user?.role === 'SALES_EXECUTIVE',
    
    // Feature-specific permissions
    canManageUsers: user?.role === 'SUPER_ADMIN',
    
    canConvertLeads: user?.role === 'SUPER_ADMIN' || user?.role === 'SALES_EXECUTIVE',
    
    canEditProject: (projectDeptId: number) => 
      user?.role === 'SUPER_ADMIN' || (user?.role === 'PROJECT_MANAGER' && isSameDept(projectDeptId)),
    
    canManageTasks: (projectDeptId: number) =>
      user?.role === 'SUPER_ADMIN' || isSameDept(projectDeptId),

    canDeleteData: user?.role === 'SUPER_ADMIN',

    // Scoping
    currentDeptSlug: user?.department?.name.toLowerCase().replace(" ", "_") || 'global'
  };
};

/**
 * Usage Example in Component:
 * 
 * const { canConvertLeads, isAdmin } = usePermissions();
 * 
 * return (
 *   <>
 *     {canConvertLeads && <button>Convert to Project</button>}
 *     {isAdmin && <button className="btn-danger">Delete User</button>}
 *   </>
 * )
 */