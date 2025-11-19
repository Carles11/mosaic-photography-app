import { supabase } from "@/4-shared/api/supabaseClient";

type ConfirmEmailChangeResult = {
  error: string | null;
};

export async function confirmEmailChange(
  email: string,
  token: string,
  type: string
): Promise<ConfirmEmailChangeResult> {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: type as "email_change",
    });

    return {
      error: error?.message ?? null,
    };
  } catch (err) {
    return {
      error: "Email change confirmation failed. Please try again.",
    };
  }
}
