import { supabase } from "@/4-shared/api/supabaseClient";

type ForgotPasswordResult = {
  error: string | null;
};

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "mosaicphotographyapp://auth/password-reset",
  });

  return {
    error: error?.message ?? null,
  };
}
