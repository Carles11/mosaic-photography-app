export interface Report {
  id: string;
  reporter_id: string;
  reported_user_id?: string | null;
  comment_id?: string | null;
  image_id?: number | null;
  reason: string;
  created_at: string;
  status: "pending" | "reviewed" | "rejected" | string;
  reviewed_by?: string | null;
}

// Helper type for creating a new report (fields required on creation)
export interface NewReport {
  reporter_id: string;
  reported_user_id?: string | null;
  comment_id?: string | null;
  image_id?: number | null;
  reason: string;
}
