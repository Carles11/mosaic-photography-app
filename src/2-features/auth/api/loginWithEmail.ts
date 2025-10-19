import { supabase } from "@/4-shared/api/supabaseClient";

type LoginResult = {
  error: string | null;
};

export async function loginWithEmail(
  email: string,
  password: string
): Promise<LoginResult> {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    error: error?.message ?? null,
  };
}
