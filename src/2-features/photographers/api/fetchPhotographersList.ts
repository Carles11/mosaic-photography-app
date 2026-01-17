import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { Dimensions } from "react-native";

import { PhotographerListItem } from "@/4-shared/types";

/**
 * Fetch photographers with optional limit and optional target image width (in px).
 * Uses the public.photographers_with_portrait view to return one portrait per photographer in a single query.
 * Adds a lightweight in-memory cache for the session to avoid repeated DB calls.
 *
 * @param limit optional number of photographers to return
 * @param targetImageWidth optional target width in px for portraits (defaults to device width)
 */
const _photographersCache: Record<string, PhotographerListItem[]> = {};

export async function fetchPhotographersList(
  limit?: number,
  targetImageWidth?: number
): Promise<PhotographerListItem[]> {
  const resolvedTargetWidth =
    typeof targetImageWidth === "number"
      ? targetImageWidth
      : Dimensions.get("window").width;

  const cacheKey = `limit:${limit ?? "all"}|w:${resolvedTargetWidth}`;
  if (_photographersCache[cacheKey]) {
    return _photographersCache[cacheKey].slice();
  }

  // Query the view photographers_with_portrait in a single request
  let query = supabase
    .from("photographers_with_portrait")
    .select(
      "id, name, surname, slug, author, intro, filename, base_url, img_width"
    )
    .order("surname");

  if (typeof limit === "number" && limit > 0) {
    query = (query as any).limit(limit);
  }

  const { data: rows, error } = await query;

  if (error || !rows) {
    console.warn("[fetchPhotographersList] view query error", error);
    return [];
  }

  // Build result list using getBestS3FolderForWidth with the portrait info from the view
  const deviceWidth = resolvedTargetWidth;
  const result: PhotographerListItem[] = rows.map((r: any) => {
    let portrait = "";
    if (r.filename && r.base_url) {
      const best = getBestS3FolderForWidth(
        {
          filename: r.filename,
          base_url: r.base_url,
          width: r.img_width,
        },
        deviceWidth
      );
      portrait = best.url;
    }

    return {
      id: r.id,
      name: r.name,
      surname: r.surname,
      slug: r.slug,
      intro: r.intro,
      author: r.author,
      portrait,
    };
  });

  _photographersCache[cacheKey] = result.slice();
  return result;
}
