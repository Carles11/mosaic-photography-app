import { supabase } from "@/4-shared/api/supabaseClient";

type PasswordResetResult = {
  error: string | null;
};

export async function passwordReset(
  accessToken: string,
  newPassword: string
): Promise<PasswordResetResult> {
  // 1. Set the session with the access token from the reset link
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: "", // Not needed for password reset
  });

  if (sessionError) {
    return { error: sessionError.message };
  }

  // 2. Now update the password
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  return {
    error: error?.message ?? null,
  };
}
