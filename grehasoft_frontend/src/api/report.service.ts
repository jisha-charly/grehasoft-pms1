import api from './axiosInstance';

export interface DashboardStats {
  kpis: {
    total_leads: number;
    conversion_rate: number;
    active_projects: number;
    pending_tasks: number;
  };
  charts: {
    leads: Record<string, number>;
    projects: Record<string, number>;
    tasks: Record<string, number>;
  };
}

export const reportService = {
  getDashboardStats: (department?: string) => {
    const params = department ? { department } : {};
    return api.get<DashboardStats>('reports/dashboard-stats/', { params });
  },

  getActivityLogs: (params?: any) => api.get('audit/logs/', { params }),
};