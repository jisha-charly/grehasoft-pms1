export interface ActivityLog {
  id: number;
  user: number;
  action: string;
  model_name: string;
  object_id: number;
  timestamp: string;
  description?: string;
}
