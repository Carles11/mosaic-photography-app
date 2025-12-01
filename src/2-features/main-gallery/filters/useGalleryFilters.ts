import {
  GalleryFilter,
  UseGalleryFiltersReturn,
} from "@/4-shared/types/gallery";
import { useCallback, useMemo, useState } from "react";

export function useGalleryFilters(
  defaultFilters?: GalleryFilter
): UseGalleryFiltersReturn {
  const [filters, setFilters] = useState<GalleryFilter>(defaultFilters ?? {});

  // Determine if any filters are active
  const filtersActive = useMemo(() => {
    return (
      !!filters.gender ||
      !!filters.orientation ||
      !!filters.color ||
      !!filters.print_quality ||
      (filters.year &&
        typeof filters.year.from === "number" &&
        typeof filters.year.to === "number") ||
      (!!filters.text && filters.text.trim() !== "") ||
      (Array.isArray(filters.author) && filters.author.length > 0)
    );
  }, [filters]);

  const resetFilters = useCallback(() => setFilters({}), []);

  return {
    filters,
    setFilters,
    resetFilters,
    filtersActive,
  };
}
