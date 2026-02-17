/**
 * Grehasoft Centralized Route Paths
 */
export const PATHS = {
  AUTH: {
    LOGIN: '/login',
    RESET_PASSWORD: '/reset-password',
    UNAUTHORIZED: '/403',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    SOFTWARE: '/dashboard/software',
    MARKETING: '/dashboard/marketing',
    EXECUTIVE: '/dashboard/executive',
  },
  CRM: {
    ROOT: '/crm',
    LEADS: '/crm/leads',
    LEAD_DETAILS: (id: number | string) => `/crm/leads/${id}`,
    CLIENTS: '/crm/clients',
    CLIENT_DETAILS: (id: number | string) => `/crm/clients/${id}`,
  },
  PMS: {
    ROOT: '/pms',
    PROJECTS: '/pms/projects',
    PROJECT_DETAILS: (id: number | string) => `/pms/projects/${id}`,
    KANBAN: (projectId: number | string) => `/pms/projects/${projectId}/kanban`,
    MY_TASKS: '/pms/my-tasks',
  },
  ADMIN: {
    ROOT: '/admin',
    USERS: '/admin/users',
    AUDIT_LOGS: '/admin/audit-logs',
    DEPARTMENT_SETTINGS: '/admin/departments',
  },
  PROFILE: '/profile',
};