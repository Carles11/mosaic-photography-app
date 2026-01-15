import { supabase } from "@/4-shared/api/supabaseClient";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import * as SecureStore from "expo-secure-store";
import { useCallback } from "react";

const STORAGE_KEY = "mosaic:nudity_consent";

/**
 * useNudityConsent
 * - hasConsent(): Promise<boolean>
 * - confirmConsent({ confirmedAt }): Promise<void>
 * - revokeConsent(): Promise<void>
 *
 * Logged-in users: consent is stored inside user_profiles.filters as nudity_consent.
 * Anonymous users: consent is stored locally in SecureStore.
 */
export function useNudityConsent() {
  const { user } = useAuthSession();

  const hasConsent = useCallback(async (): Promise<boolean> => {
    if (user?.id) {
      try {
        const { data } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();
        return !!data?.filters?.nudity_consent;
      } catch (e) {
        console.warn("useNudityConsent.hasConsent supabase error:", e);
        return false;
      }
    } else {
      try {
        const v = await SecureStore.getItemAsync(STORAGE_KEY);
        return !!v;
      } catch (e) {
        console.warn("useNudityConsent.hasConsent securestore error:", e);
        return false;
      }
    }
  }, [user?.id]);

  const confirmConsent = useCallback(
    async (payload: { confirmedAt: string }) => {
      if (user?.id) {
        try {
          // Read existing filters (if any) and merge in nudity_consent
          const { data: profile, error } = await supabase
            .from("user_profiles")
            .select("filters")
            .eq("id", user.id)
            .single();

          let existingFilters = {};
          if (!error && profile?.filters) existingFilters = profile.filters;

          const updatedFilters = {
            ...((existingFilters as any) ?? { nudity: "not-nude" }),
            nudity_consent: { optedIn: true, confirmedAt: payload.confirmedAt },
          };

          await supabase.from("user_profiles").upsert({
            id: user.id,
            filters: updatedFilters,
            updated_at: new Date().toISOString(),
          });
        } catch (e) {
          console.warn("useNudityConsent.confirmConsent supabase error:", e);
        }
      } else {
        try {
          await SecureStore.setItemAsync(
            STORAGE_KEY,
            JSON.stringify({ confirmedAt: payload.confirmedAt })
          );
        } catch (e) {
          console.warn("useNudityConsent.confirmConsent securestore error:", e);
        }
      }
    },
    [user?.id]
  );

  const revokeConsent = useCallback(async () => {
    if (user?.id) {
      try {
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();
        const filters = profile?.filters ?? { nudity: "not-nude" };
        // remove nudity_consent key if present
        const { nudity_consent, ...rest } = filters as any;
        await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: rest,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn("useNudityConsent.revokeConsent supabase error:", e);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEY);
      } catch (e) {
        console.warn("useNudityConsent.revokeConsent securestore error:", e);
      }
    }
  }, [user?.id]);

  return { hasConsent, confirmConsent, revokeConsent };
}

export default useNudityConsent;
