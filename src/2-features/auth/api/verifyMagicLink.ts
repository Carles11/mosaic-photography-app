import { supabase } from "@/4-shared/api/supabaseClient";

type VerifyMagicLinkResult = {
  error: string | null;
};

export async function verifyMagicLink(
  email: string,
  token: string,
  type: string
): Promise<VerifyMagicLinkResult> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: type as
        | "magiclink"
        | "recovery"
        | "invite"
        | "signup"
        | "email"
        | "email_change",
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
