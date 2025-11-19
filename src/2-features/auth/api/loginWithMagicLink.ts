import { supabase } from "@/4-shared/api/supabaseClient";
import { saveMagicLinkEmail } from "@/4-shared/utility/emailStorage";

type MagicLinkResult = {
  error: string | null;
};

export async function loginWithMagicLink(
  email: string
): Promise<MagicLinkResult> {
  await saveMagicLinkEmail(email);

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: "https://www.mosaic.photography/auth/magic-link",
    },
  });

  return {
    error: error?.message ?? null,
  };
}
