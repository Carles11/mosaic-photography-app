import { supabase } from "@/4-shared/api/supabaseClient";
import { useAuthSession } from "@/4-shared/context/auth/AuthSessionContext";
import { GalleryFilter } from "@/4-shared/types/gallery";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * FiltersContext
 * - Provides filters, setFilters(newFilters), clearFilters(), filtersActive
 * - Persists to user_profiles.filters for logged-in users (debounced save)
 *
 * Notes:
 * - Debounce delay: 1000ms
 * - When persisting for logged-in users we READ the current server row and MERGE serverFilters
 *   with local filters before upserting. This preserves server-only keys such as nudity_consent.
 */

type FiltersContextType = {
  filters: GalleryFilter;
  setFilters: (filters: GalleryFilter) => void;
  clearFilters: () => void;
  filtersActive: boolean;
  loadingProfile: boolean;
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export const useFilters = (): FiltersContextType => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
};

export const FiltersProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading: authLoading } = useAuthSession();
  const [filters, setFiltersState] = useState<GalleryFilter>({
    nudity: "not-nude",
  });

  const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<any>(null);

  // Compute filtersActive with same logic used elsewhere
  const filtersActive = useMemo(() => {
    const f = filters ?? ({} as GalleryFilter);
    const nudityValue = (f as any).nudity;
    const includeNudesFlag = (f as any).includeNudes;
    const nudityActive = nudityValue !== undefined || !!includeNudesFlag;

    const year = f.year ?? { from: 0, to: 0 };
    const yearActive =
      typeof year.from === "number" &&
      typeof year.to === "number" &&
      (year.from !== 0 || year.to !== 0);

    return (
      !!f.gender ||
      !!f.orientation ||
      !!f.color ||
      !!f.print_quality ||
      yearActive ||
      (!!f.text && f.text.trim() !== "") ||
      (Array.isArray(f.author) && f.author.length > 0) ||
      nudityActive
    );
  }, [filters]);

  // Load saved filters for the user when user becomes available
  useEffect(() => {
    let mounted = true;
    async function loadUserFilters() {
      if (!user?.id) {
        // ensure local state is not stale when no user
        if (mounted) setFiltersState({ nudity: "not-nude" });
        lastSavedRef.current = null;
        return;
      }
      setLoadingProfile(true);
      try {
        const { data, error } = await supabase
          .from("user_profiles")
          .select("filters")
          .eq("id", user.id)
          .single();

        if (error) {
          // row may not exist — keep defaults
          // console.warn("loadUserFilters error", error);
        } else if (mounted) {
          if (data?.filters) {
            setFiltersState(data.filters as GalleryFilter);
            lastSavedRef.current = data.filters;
          } else {
            // no saved filters: keep default nudity
            setFiltersState({ nudity: "not-nude" });
            lastSavedRef.current = { nudity: "not-nude" };
          }
        }
      } catch (e) {
        console.warn("Failed to load user filters:", e);
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }
    loadUserFilters();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  // Persist filters when they change (debounced). Only persist for logged-in users.
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

    // Debounced save that reads server filters and MERGES before upsert to preserve server-only keys.
    saveTimeout.current = setTimeout(async () => {
      try {
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
            "[FiltersProvider] failed to read existing filters before save:",
            e
          );
        }

        const mergedFilters = {
          ...(serverFilters ?? {}),
          ...(filters ?? {}),
        };

        console.debug(
          "[FiltersProvider] upserting mergedFilters:",
          mergedFilters
        );

        const { error } = await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: mergedFilters,
          updated_at: new Date().toISOString(),
        });

        if (error) {
          console.warn("[FiltersProvider] Failed to save user filters:", error);
        } else {
          lastSavedRef.current = mergedFilters ?? {};
        }
      } catch (e) {
        console.error("[FiltersProvider] Error saving user filters:", e);
      }
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
    };
  }, [filters, user?.id]);

  const setFilters = (next: GalleryFilter) => {
    setFiltersState(next);
  };

  const clearFilters = () => {
    setFiltersState({ nudity: "not-nude" });
    // persist immediately if user is logged in
    if (!user?.id) return;
    (async () => {
      try {
        // Read current server-side filters to preserve server-only keys then overwrite filter fields
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
            "[FiltersProvider] failed to read existing filters before clear:",
            e
          );
        }

        const mergedFilters = {
          ...(serverFilters ?? {}),
          // overwrite user-visible filters to defaults
          nudity: "not-nude",
        };

        console.debug(
          "[FiltersProvider] clearing filters, upserting mergedFilters:",
          mergedFilters
        );

        const { error } = await supabase.from("user_profiles").upsert({
          id: user.id,
          filters: mergedFilters,
          updated_at: new Date().toISOString(),
        });
        if (error)
          console.warn(
            "[FiltersProvider] Failed to clear user filters:",
            error
          );
        lastSavedRef.current = mergedFilters ?? { nudity: "not-nude" };
      } catch (e) {
        console.warn("[FiltersProvider] Error clearing user filters:", e);
      }
    })();
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setFilters,
        clearFilters,
        filtersActive,
        loadingProfile,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};
