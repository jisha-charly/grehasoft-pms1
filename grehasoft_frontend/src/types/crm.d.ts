export interface Lead {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  source: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  assigned_to?: number | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address?: string;
  created_at: string;
}

export interface LeadFollowUp {
  id: number;
  lead: number;
  method: 'CALL' | 'EMAIL' | 'MEETING';
  notes: string;
  next_followup_date?: string;
  is_completed: boolean;
  created_at: string;
  created_by: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
