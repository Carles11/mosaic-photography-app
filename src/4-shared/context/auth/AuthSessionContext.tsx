import { supabase } from "@/4-shared/api/supabaseClient";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function useAuthSession() {
  return useContext(AuthContext);
}

export function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check for existing session (persistent login)
    const initAuth = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        if (
          error.message &&
          error.message.toLowerCase().includes("invalid refresh token")
        ) {
          setUser(null);
          await supabase.auth.signOut();
        }
        setLoading(false);
        return;
      }

      if (data?.session?.user) {
        setUser(data.session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    initAuth();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
