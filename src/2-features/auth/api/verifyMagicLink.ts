import { supabase } from "@/4-shared/api/supabaseClient";

type VerifyMagicLinkResult = {
  error: string | null;
};

export async function verifyMagicLink(
  token: string,
  type: string
): Promise<VerifyMagicLinkResult> {
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
      error: "Magic link verification failed. Please try again.",
    };
  }
}
