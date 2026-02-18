

export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: number;
  name: string;
  description: string;
  client: number;
  client_name: string;
  department: number;
  department_name: string;
  project_manager: number;
  manager_name: string;
  start_date: string;
  end_date: string | null;
  status: ProjectStatus;
  progress_percentage: number;
  task_count: number;
  created_at: string;
  // Included in ProjectDetail view
  members?: ProjectMember[];
  milestones?: Milestone[];
}

export interface ProjectMember {
  id: number;
  user: number;
  user_details: {
    id: number;
    full_name: string;
    email: string;
    role_slug: string;
  };
  role_in_project: 'PM' | 'MEMBER' | 'QA' | 'VIEWER';
  added_at: string;
}

export interface Milestone {
  id: number;
  project: number;
  title: string;
  due_date: string;
  is_completed: boolean;
}

export interface Task {
  id: number;
  project: number;
  project_name: string;
  milestone: number | null;
  task_type: number;
  task_type_name: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  board_order: number;
  due_date: string | null;
  assigned_users: {
    id: number;
    full_name: string;
    email: string;
    role_slug: string;
  }[];
  created_at: string;
}

export interface TaskFile {
  id: number;
  task: number;
  file_path: string; // URL to the file
  file_type: string;
  revision_no: number;
  is_current_version: boolean;
  uploaded_by_name: string;
  created_at: string;
}

export interface TaskComment {
  id: number;
  task: number;
  user: number;
  user_name: string;
  comment: string;
  created_at: string;
}
export const KANBAN_COLUMNS = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];
