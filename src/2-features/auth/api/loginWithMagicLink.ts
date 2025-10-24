import { supabase } from "@/4-shared/api/supabaseClient";

type MagicLinkResult = {
  error: string | null;
};

export async function loginWithMagicLink(
  email: string
): Promise<MagicLinkResult> {
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
