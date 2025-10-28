import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import type { PhotographerSlug } from "@/4-shared/types";
import { Dimensions } from "react-native";

export async function fetchPhotographerBySlug(
  slug: string
): Promise<PhotographerSlug | null> {
  // 1. Fetch photographer by slug
  const { data: photographer, error: photographerError } = await supabase
    .from("photographers")
    .select(
      `
      id, name, surname, slug, origin, biography, birthdate, deceasedate, website, store, author
    `
    )
    .eq("slug", slug)
    .single();

  if (photographerError || !photographer) return null;

  // 2. Fetch all images for this photographer from images_resize
  const { data: images, error: imagesError } = await supabase
    .from("images_resize")
    .select(
      "id, filename, base_url, width, orientation, title, year, description"
    )
    .eq("author", photographer.author)
    .eq("nudity", "not-nude");

  const deviceWidth = Dimensions.get("window").width;

  // 3. Map images to use the best available resolution in the CDN
  const processedImages = (images ?? []).map((img) => {
    const best = getBestS3FolderForWidth(
      {
        filename: img.filename,
        base_url: img.base_url,
        width: img.width,
      },
      deviceWidth
    );
    return {
      ...img,
      url: best.url,
      width: best.width,
    };
  });

  return {
    ...photographer,
    images: processedImages,
  };
}
