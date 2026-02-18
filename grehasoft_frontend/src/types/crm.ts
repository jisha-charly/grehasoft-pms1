


export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
export type LeadSource = 'website' | 'linkedin' | 'referral' | 'cold_call' | 'other';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  source: LeadSource;
  status: LeadStatus;
  department: number; // ID for POST
  department_name: string; // Read-only for UI
  converted_project: number | null;
  is_converted: boolean;
  followup_count: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  name: string;
  company_name: string;
  email: string;
  phone: string;
  tax_id?: string;
  address?: string;
  website?: string;
  department: number;
  department_name: string;
  created_at: string;
}

export interface LeadFollowUp {
  id: number;
  lead: number;
  method: 'call' | 'email' | 'whatsapp' | 'meeting';
  notes: string;
  next_followup_date?: string;
  is_completed: boolean;
  created_at: string;
  created_by_name: string;
}

export interface PaginatedResponse<T> {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: T[];
}