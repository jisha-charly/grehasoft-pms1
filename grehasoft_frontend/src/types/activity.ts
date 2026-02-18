export interface ActivityLog {
  id: number;
  user?: number;  
  department_name: string;   // ✅ add this             // optional if backend still sends it
  user_full_name: string;      // 👈 ADD THIS
  action: string;
  created_at: string;
}
