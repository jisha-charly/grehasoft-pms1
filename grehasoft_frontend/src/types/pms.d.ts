export interface Project {
  id: number;
  name: string;
  description?: string;
  client: number;
  project_manager: number;
  status: 'PLANNING' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED';
  start_date?: string;
  end_date?: string;
  progress_percentage: number;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  project: number;
  assigned_to?: number | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  board_order: number;
  due_date?: string;
  created_at: string;
}

export interface TaskFile {
  id: number;
  task: number;
  file_path: string;
  file_type: string;
  uploaded_at: string;
}

export interface Milestone {
  id: number;
  project: number;
  title: string;
  description?: string;
  due_date: string;
  is_completed: boolean;
}
