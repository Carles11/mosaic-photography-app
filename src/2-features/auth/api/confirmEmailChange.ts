import { supabase } from "@/4-shared/api/supabaseClient";

type ConfirmEmailChangeResult = {
  error: string | null;
};

/**
 * Confirm an email change using the token and type from the confirmation link.
 * Called as confirmEmailChange(token, type).
 *
 * NOTE: The Supabase client type definitions require an `email` (or `phone`) field
 * for the strongly-typed `verifyOtp` parameter. In this flow we only have the
 * token and the type (e.g. "email_change"), so we cast the params to `any`
 * to avoid the TypeScript type error while keeping runtime behavior unchanged.
 */
export async function confirmEmailChange(
  token: string,
  type: string
): Promise<ConfirmEmailChangeResult> {
  try {
    // Cast to any because the client types require email/phone but the runtime call
    // works with token + type for this flow.
    const { error } = await supabase.auth.verifyOtp({ token, type } as any);

    return {
      error: error?.message ?? null,
    };
  } catch (err) {
    return {
      error: "Email change confirmation failed. Please try again.",
    };
  }
}
