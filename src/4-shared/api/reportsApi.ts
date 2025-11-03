import { NewReport, Report } from "@/3-entities/reports/models";
import { supabase } from "@/4-shared/api/supabaseClient";

export interface SubmitReportResult {
  data: Report | null;
  error: string | null;
}

export async function submitReport(
  newReport: NewReport
): Promise<SubmitReportResult> {
  // Get the current session and access token
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    return { data: null, error: "User is not authenticated." };
  }

  // Make the request with the access token in the Authorization header
  const { data, error } = await supabase
    .from("reports")
    .insert([newReport])
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
