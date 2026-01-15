import { useGalleryFilters } from "@/2-features/main-gallery/filters/useGalleryFilters";
import { supabase } from "@/4-shared/api/supabaseClient";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import {
  GalleryFilter,
  UseGalleryFiltersReturn,
} from "@/4-shared/types/gallery";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Wraps useGalleryFilters and persists filters to user_profiles.filters for logged-in users.
 *
 * - Loads filters on auth change (if user has saved filters).
 * - Saves (upsert) filters after a small debounce when they change.
 *
 * Returns the same shape as UseGalleryFiltersReturn.
 */
export function usePersistentGalleryFilters(
  defaultFilters?: GalleryFilter
): UseGalleryFiltersReturn & { loadingProfile: boolean } {
  const { user, loading: authLoading } = useAuthSession();
  // Initialize inner hook with defaultFilters so local default behavior stays the same
  const { filters, setFilters, resetFilters, filtersActive } =
    useGalleryFilters(defaultFilters);

  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<any>(null);

  // Load saved filters for the user when user becomes available
  useEffect(() => {
    let mounted = true;
    async function loadProfileFilters() {
      if (!user?.id) {
        // nothing to load
        return;
      }
      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();
        if (!mounted) return;
        if (error && error.code !== "PGRST116") {
          // log non-empty-row errors; PGRST116 can appear when row missing depending on Supabase client/runtime
          console.warn("Error loading user profile filters:", error);
        }
        if (data && data.filters) {
          // setFilters accepts an object matching GalleryFilter
          setFilters(data.filters as GalleryFilter);
          lastSavedRef.current = data.filters;
        }
      } catch (e) {
        console.error("Failed to load user profile filters:", e);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }
    loadProfileFilters();
    return () => {
      mounted = false;
    };
  }, [user?.id, setFilters]);

  // Persist filters when they change (debounced). Only persist for logged-in users.
  useEffect(() => {
    if (!user?.id) {
      return;
    }

    // Avoid saving if identical to last saved value
    try {
      const prev = JSON.stringify(lastSavedRef.current ?? null);
      const curr = JSON.stringify(filters ?? {});
      if (prev === curr) {
        return;
      }
    } catch {
      // fallback to saving
    }

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }
    // --- Replace the current upsert save block with this ---
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
        } catch (e) {
          console.debug(
            "[usePersistentGalleryFilters] failed to read existing filters before save:",
            e
          );
        }

        const mergedFilters = {
          ...(serverFilters ?? {}),
          ...(filters ?? {}),
        };

        console.debug(
          "[usePersistentGalleryFilters] upserting mergedFilters:",
          mergedFilters
        );

        const { error } = await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: mergedFilters,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          console.warn(
            "[usePersistentGalleryFilters] Failed to save user filters:",
            error
          );
        } else {
          lastSavedRef.current = mergedFilters ?? {};
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

  // Provide a reset that also persists the reset when user logged in
  const persistentResetFilters = useCallback(() => {
    resetFilters();
    if (!user?.id) return;
    // immediate update (no debounce) so UI and DB remain consistent
    (async () => {
      try {
        const { error } = await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: {},
          updated_at: new Date().toISOString(),
        });
        if (error) console.warn("Failed to reset user filters:", error);
        lastSavedRef.current = {};
      } catch (e) {
        console.error("Error resetting user filters:", e);
      }
    })();
  }, [resetFilters, user?.id]);

  return {
    filters,
    setFilters,
    resetFilters: persistentResetFilters,
    filtersActive,
    loadingProfile: authLoading || loadingProfile,
  };
}
