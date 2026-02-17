import api from './axiosInstance';
import { Project, Task, TaskFile, Milestone, PaginatedResponse } from '../types/pms';

export const pmsService = {
  // Projects
  getProjects: (params?: any) => api.get<PaginatedResponse<Project>>('pms/projects/', { params }),
  getProject: (id: number) => api.get<Project>(`pms/projects/${id}/`),
  createProject: (data: Partial<Project>) => api.post<Project>('pms/projects/', data),
  updateProject: (id: number, data: Partial<Project>) => api.patch<Project>(`pms/projects/${id}/`, data),

  // Tasks & Kanban
  getTasks: (projectId: number, params?: any) => 
    api.get<Task[]>(`pms/tasks/`, { params: { project: projectId, ...params } }),
  
  updateTaskStatus: (taskId: number, status: string, boardOrder: number) => 
    api.patch(`pms/tasks/${taskId}/`, { status, board_order: boardOrder }),

  createTask: (data: Partial<Task>) => api.post<Task>('pms/tasks/', data),

  // File Management (Multipart)
  uploadTaskFile: (taskId: number, file: File) => {
    const formData = new FormData();
    formData.append('task', taskId.toString());
    formData.append('file_path', file);
    formData.append('file_type', file.type);
    return api.post<TaskFile>('pms/task-files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  getTaskFiles: (taskId: number) => api.get<TaskFile[]>(`pms/task-files/?task=${taskId}`),

  // Milestones
  getMilestones: (projectId: number) => api.get<Milestone[]>(`pms/milestones/?project=${projectId}`),
};