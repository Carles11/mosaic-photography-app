// @/2-features/auth/api/verifyEmail.ts - WITH EMAIL
import { supabase } from "@/4-shared/api/supabaseClient";

type VerifyEmailResult = {
  error: string | null;
};

export async function verifyEmail(
  email: string,
  token: string,
  type: string
): Promise<VerifyEmailResult> {
  try {
    console.log("[verifyEmail] Starting verification with:", {
      email,
      token: token ? `${token.substring(0, 10)}...` : "empty",
      type,
    });

    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: type as any,
    });

    if (error) {
      console.error("[verifyEmail] verifyOtp error:", error);
      return { error: error.message };
    }

    console.log("[verifyEmail] Email verified successfully");
    return { error: null };
  } catch (err: any) {
    console.error("[verifyEmail] Unexpected error:", err);
    return {
      error: err?.message || "Email verification failed. Please try again.",
    };
  }
}
