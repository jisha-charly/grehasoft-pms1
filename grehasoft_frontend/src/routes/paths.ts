// src/routes/paths.ts

export const PATHS = {
  AUTH: {
    LOGIN: '/login',
    UNAUTHORIZED: '/unauthorized',
  },

  DASHBOARD: {
    ROOT: '/',
    EXECUTIVE: '/dashboard/executive',
    SOFTWARE: '/dashboard/software',
    MARKETING: '/dashboard/marketing',
  },

  CRM: {
    LEADS: '/crm/leads',
    CLIENTS: '/crm/clients',
  },

  PMS: {
    PROJECTS: '/pms/projects',
    KANBAN: (projectId: number | string) => `/pms/kanban/${projectId}`,
    MY_TASKS: '/pms/my-tasks',
  },

  ADMIN: {
    USERS: '/admin/users',
    ACTIVITY: '/admin/activity',
  },

  PROFILE: '/profile',

  ERRORS: {
    NOT_FOUND: '*',
  },
};
