export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SOFTWARE'
  | 'MARKETING';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Department {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: Role;
  department: Department | null;
  is_active: boolean;
  date_joined: string;
}
