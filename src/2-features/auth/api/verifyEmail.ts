import { supabase } from "@/4-shared/api/supabaseClient";

type VerifyEmailResult = {
  error: string | null;
};

export async function verifyEmail(
  token: string,
  type: string
): Promise<VerifyEmailResult> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any,
    });

    return {
      error: error?.message ?? null,
    };
  } catch (err) {
    return {
      error: "Verification failed. Please try again.",
    };
  }
}
