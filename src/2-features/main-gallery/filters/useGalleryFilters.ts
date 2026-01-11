import {
  GalleryFilter,
  UseGalleryFiltersReturn,
} from "@/4-shared/types/gallery";
import { useCallback, useMemo, useState } from "react";

/**
 * Initializes filters with nudity default "not-nude" so the UI and fetch logic
 * behave consistently and the filters badge is shown by default.
 *
 * If you want to pass a different initial set, provide defaultFilters when calling the hook.
 */
export function useGalleryFilters(
  defaultFilters?: GalleryFilter
): UseGalleryFiltersReturn {
  // If caller didn't pass defaultFilters, set nudity default to "not-nude"
  const initial = defaultFilters ?? { nudity: "not-nude" };
  const [filters, setFilters] = useState<GalleryFilter>(initial);

  // Determine if any filters are active
  const filtersActive = useMemo(() => {
    // Nudity is considered active when it exists (including the default "not-nude")
    // or when the legacy boolean includeNudes is true.
    const nudityValue = (filters as any).nudity;
    const includeNudesFlag = (filters as any).includeNudes;
    const nudityActive = nudityValue !== undefined || !!includeNudesFlag;

    const year = filters.year ?? { from: 0, to: 0 };
    const yearActive =
      typeof year.from === "number" &&
      typeof year.to === "number" &&
      (year.from !== 0 || year.to !== 0);

    return (
      !!filters.gender ||
      !!filters.orientation ||
      !!filters.color ||
      !!filters.print_quality ||
      yearActive ||
      (!!filters.text && filters.text.trim() !== "") ||
      (Array.isArray(filters.author) && filters.author.length > 0) ||
      nudityActive
    );
  }, [filters]);

  const resetFilters = useCallback(
    () => setFilters(defaultFilters ?? { nudity: "not-nude" }),
    [defaultFilters]
  );

  return {
    filters,
    setFilters,
    resetFilters,
    filtersActive,
  };
}
