export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface OptionType {
  label: string;
  value: string | number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface BaseModel {
  id: number;
  created_at: string;
  updated_at?: string;
}
