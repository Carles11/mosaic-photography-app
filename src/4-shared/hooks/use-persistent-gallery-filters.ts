import { supabase } from "@/4-shared/api/supabaseClient";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { logEvent } from "@/4-shared/firebase";
import { GalleryFilter } from "@/4-shared/types/gallery";
import { useEffect, useRef } from "react";

/**
 * usePersistentGalleryFilters
 * - Debounced persistence of gallery filters for logged-in users.
 * - Reads current server-side filters and MERGES with local filters before upserting
 *   to avoid accidentally removing server-only keys such as nudity_consent.
 * - Emits analytics event `filters_saved` after successful merged upsert.
 *
 * Usage:
 *   usePersistentGalleryFilters(currentFilters);
 */

export function usePersistentGalleryFilters(filters: GalleryFilter) {
  const { user } = useAuthSession();
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<any>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Skip saving if identical to last saved value
    try {
      const prev = JSON.stringify(lastSavedRef.current ?? null);
      const curr = JSON.stringify(filters ?? {});
      if (prev === curr) return;
    } catch {
      // fall through to save
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        // Read current server-side filters to preserve any server-only keys (e.g., nudity_consent)
        let serverFilters: any = {};
        try {
          const { data: existing, error: readErr } = await supabase
            .from("user_profiles")
            .select("filters")
            .eq("id", user.id)
            .single();
          if (!readErr && existing?.filters) serverFilters = existing.filters;
        } catch {
          // ignore read error and proceed with local filters
        }

        const mergedFilters = {
          ...(serverFilters ?? {}),
          ...(filters ?? {}),
        };

        const { error } = await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: mergedFilters,
          updated_at: new Date().toISOString(),
        });

        if (!error) {
          lastSavedRef.current = mergedFilters ?? {};
          // Analytics: filters_saved
          try {
            logEvent("filters_saved", {
              source: "persistent_hook",
              mergedKeys: Object.keys(mergedFilters ?? {}).length,
              nudity: (mergedFilters as any)?.nudity ?? null,
              user_state: user?.id ? "logged_in" : "anonymous",
            });
          } catch {
            /* swallow analytics errors */
          }
        } else {
          console.warn(
            "[usePersistentGalleryFilters] Failed to save user filters:",
            error
          );
        }
      } catch (e) {
        console.error(
          "[usePersistentGalleryFilters] Error saving user filters:",
          e
        );
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
    };
  }, [filters, user?.id]);
}

export default usePersistentGalleryFilters;
