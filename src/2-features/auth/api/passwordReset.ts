import { supabase } from "@/4-shared/api/supabaseClient";

type PasswordResetResult = {
  error: string | null;
};

// Now requires email in addition to token and newPassword
export async function passwordReset(
  email: string,
  token: string,
  newPassword: string
): Promise<PasswordResetResult> {
  try {
    // Use verifyOtp for password reset tokens with required email param
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
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
