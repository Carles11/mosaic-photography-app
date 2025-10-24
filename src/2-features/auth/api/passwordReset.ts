import { supabase } from "@/4-shared/api/supabaseClient";

type PasswordResetResult = {
  error: string | null;
};

export async function passwordReset(
  token: string,
  newPassword: string
): Promise<PasswordResetResult> {
  try {
    // Use verifyOtp for password reset tokens
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: "recovery",
    });

    if (error) {
      return { error: error.message };
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return {
      error: updateError?.message ?? null,
    };
  } catch (err) {
    return {
      error: "Password reset failed. Please try again.",
    };
  }
}
