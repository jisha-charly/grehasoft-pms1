import api from './axiosInstance';
import { Lead, Client, LeadFollowUp, PaginatedResponse } from '../types/crm';

export const crmService = {
  // Leads
  getLeads: (params?: any) => api.get<PaginatedResponse<Lead>>('crm/leads/', { params }),
  getLead: (id: number) => api.get<Lead>(`crm/leads/${id}/`),
  createLead: (data: Partial<Lead>) => api.post<Lead>('crm/leads/', data),
  updateLead: (id: number, data: Partial<Lead>) => api.patch<Lead>(`crm/leads/${id}/`, data),
  deleteLead: (id: number) => api.delete(`crm/leads/${id}/`),

  // Custom Action: Lead to Project Conversion
  convertLead: (id: number, projectManagerId: number) => 
    api.post(`crm/leads/${id}/convert/`, { project_manager_id: projectManagerId }),

  // Clients
  getClients: (params?: any) => api.get<PaginatedResponse<Client>>('crm/clients/', { params }),
  getClient: (id: number) => api.get<Client>(`crm/clients/${id}/`),
  
  // Follow-ups
  getFollowUps: (leadId: number) => api.get<LeadFollowUp[]>(`crm/followups/?lead=${leadId}`),
  addFollowUp: (data: Partial<LeadFollowUp>) => api.post<LeadFollowUp>('crm/followups/', data),
};