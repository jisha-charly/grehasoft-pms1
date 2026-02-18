export interface DashboardKpis {
  total_leads: number;
  conversion_rate: number;
  active_projects: number;
  pending_tasks: number;
}

export interface DashboardCharts {
  leads: Record<string, number>;
  projects: Record<string, number>;
  tasks: Record<string, number>;
}

export interface DashboardStats {
  kpis: DashboardKpis;
  charts: DashboardCharts;
}

export interface ActivityLog {
  id: number;
  user_full_name: string;
  action: string;
  project_name?: string | null;
  department_name: string;
  created_at: string;
}

export interface ActivityLogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ActivityLog[];
}
