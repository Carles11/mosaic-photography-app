import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { GalleryImage } from "@/4-shared/types";

/**
 * Fetches favorite images from Supabase given a Set of IDs and user status.
 * Returns an empty array if not logged in or no favorites.
 */
export async function fetchFavoriteImages(
  favorites: Set<string | number>,
  isLoggedIn: boolean
): Promise<GalleryImage[]> {
  if (!isLoggedIn || favorites.size === 0) {
    return [];
  }
  const imageIds = Array.from(favorites);
  const { data, error } = await supabase
    .from("images_resize")
    .select(
      "id, base_url, filename, author, title, description, orientation, created_at, width, height, year, photographers (slug)"
    )
    .in("id", imageIds);

  if (error || !data) {
    return [];
  }
  return data.map((img) => {
    const { url } = getBestS3FolderForWidth(img, 100);
    return {
      ...img,
      url,
      thumbnailUrl: url,
    };
  });
}
