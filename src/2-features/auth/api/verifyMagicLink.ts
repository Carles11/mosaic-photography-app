import { supabase } from "@/4-shared/api/supabaseClient";

type VerifyMagicLinkResult = {
  error: string | null;
};

export async function verifyMagicLink(
  email: string,
  token: string,
  type: string,
  refreshToken?: string
): Promise<VerifyMagicLinkResult> {
  try {
    if (type === "magiclink") {
      // For magic links, we need to create a session with both access_token and refresh_token
      const { data, error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken || "", // Use provided refresh token or empty string
      });

      if (error) {
        // If setSession fails, try an alternative approach - use verifyOtp with the token
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email: email,
          token: token,
          type: "magiclink" as any,
        });

        if (verifyError) {
          return { error: verifyError.message };
        }

        return { error: null };
      }

      return { error: null };
    } else {
      // For other OTP types (email, recovery, etc.), use verifyOtp
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: type as any,
      });

      return {
        error: error?.message ?? null,
      };
    }
  } catch (err: any) {
    return {
      error:
        err?.message || "Magic link verification failed. Please try again.",
    };
  }
}
