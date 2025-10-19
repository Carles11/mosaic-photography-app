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
  });

  return {
    error: error?.message ?? null,
  };
}
