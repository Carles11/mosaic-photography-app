import { supabase } from "@/4-shared/api/supabaseClient";

type RegisterResult = {
  error: string | null;
};

export async function registerWithEmail(
  email: string,
  password: string
): Promise<RegisterResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "mosaicphotographyapp://auth/verify-email",
    },
  });

  return {
    error: error?.message ?? null,
  };
}
