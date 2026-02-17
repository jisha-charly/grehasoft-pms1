export type UserRole = 'SUPER_ADMIN' | 'PROJECT_MANAGER' | 'TEAM_MEMBER' | 'SALES_EXECUTIVE';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface Department {
  id: number;
  name: string;
  description?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  role_name: string; // Human readable from get_slug_display
  department: Department | null;
  department_name?: string;
  status: UserStatus;
  is_staff: boolean;
  date_joined: string; // ISO Date string
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface JWTPayload {
  user_id: number;
  email: string;
  role: UserRole;
  department: string; // Normalized string like 'software'
  first_name: string;
  last_name: string;
  exp: number;
}