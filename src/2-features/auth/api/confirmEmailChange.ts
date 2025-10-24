import { supabase } from "@/4-shared/api/supabaseClient";

type ConfirmEmailChangeResult = {
  error: string | null;
};

export async function confirmEmailChange(
  token: string,
  type: string
): Promise<ConfirmEmailChangeResult> {
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
      error: "Email change confirmation failed. Please try again.",
    };
  }
}
