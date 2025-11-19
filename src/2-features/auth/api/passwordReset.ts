import { supabase } from "@/4-shared/api/supabaseClient";

type PasswordResetResult = {
  error: string | null;
};

export async function passwordReset(
  newPassword: string,
  accessToken: string,
  refreshToken?: string
): Promise<PasswordResetResult> {
  try {
    // This is the critical part!
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    if (sessionError) {
      return {
        error: sessionError.message || "Failed to authenticate reset link.",
      };
    }

    // Now update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error: updateError?.message ?? null };
  } catch (err: any) {
    return {
      error: err?.message || "Password reset failed. Please try again.",
    };
  }
}
