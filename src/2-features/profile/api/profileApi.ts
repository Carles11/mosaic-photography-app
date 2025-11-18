import { supabase } from "@/4-shared/api/supabaseClient";
import { ProfileData } from "@/4-shared/types";

export async function getProfile(userId: string): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error && error.code !== "PGRST116") {
    throw error;
  }
  return data || null;
}

export async function createProfile(
  profile: ProfileData
): Promise<ProfileData | null> {
  const { data, error } = await supabase
    .from("user_profiles")
    .insert([profile])
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data as ProfileData;
}

export async function updateProfile(
  userId: string,
  updatedData: Partial<ProfileData>
): Promise<boolean> {
  const { error } = await supabase
    .from("user_profiles")
    .upsert([{ id: userId, ...updatedData }], { onConflict: "id" });
  if (error) {
    throw error;
  }
  return true;
}

// Updated function to call Supabase Edge Function for account deletion

export async function deleteProfile(): Promise<boolean> {
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) throw new Error("Supabase URL not set.");

  const session = await supabase.auth.getSession();
  const access_token = session.data.session?.access_token;
  if (!access_token) throw new Error("User not authenticated.");

  const res = await fetch(`${supabaseUrl}/functions/v1/delete-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    // No body needed
  });

  if (!res.ok) {
    let errorMsg = "Failed to delete user";
    try {
      const error = await res.json();
      errorMsg = error.error || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return true;
}
