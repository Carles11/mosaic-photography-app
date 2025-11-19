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
      error: "Verification failed. Please try again.",
    };
  }
}
