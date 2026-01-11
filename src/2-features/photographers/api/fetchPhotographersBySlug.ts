import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import type { PhotographerSlug } from "@/4-shared/types";

/**
 * Fetch photographer data and images.
 * @param slug - photographer slug to fetch
 * @param includeNudes - false (default) to hide nude images; true to include nude images.
 */
export async function fetchPhotographerBySlug(
  slug: string,
  includeNudes: boolean = false
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

  // 2. Fetch images for this photographer (apply not-nude filter by default)
  let imagesQuery = supabase
    .from("images_resize")
    .select(
      `
      id,
      base_url,
      filename,
      author,
      title,
      description,
      created_at,
      orientation,
      width,
      height,
      print_quality,
      gender,
      color,
      nudity,
      year
    `
    )
    .eq("author", photographer.author);

  if (!includeNudes) {
    imagesQuery = imagesQuery.eq("nudity", "not-nude");
  }

  const { data: notNudeImages, error: notNudeError } = await imagesQuery;

  // 3. Fetch all 000_aaa_ portrait images for this photographer (any nudity)
  // These portrait files are always included regardless of nudity
  const { data: portraitImages, error: portraitError } = await supabase
    .from("images_resize")
    .select(
      `
      id,
      base_url,
      filename,
      author,
      title,
      description,
      created_at,
      orientation,
      width,
      height,
      print_quality,
      gender,
      color,
      nudity,
      year
    `
    )
    .eq("author", photographer.author)
    .ilike("filename", "000_aaa_%");

  if (notNudeError || portraitError) {
    console.log(
      "Error fetching photographer images:",
      notNudeError || portraitError
    );
  }

  // 4. Combine, removing duplicates by id
  const allImagesMap: Record<string, any> = {};
  (notNudeImages ?? []).forEach((img) => {
    allImagesMap[img.id] = img;
  });
  (portraitImages ?? []).forEach((img) => {
    allImagesMap[img.id] = img;
  });
  const allImages = Object.values(allImagesMap);

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  const processedImages = allImages.map((img) => ({
    ...img,
    url: getBestS3FolderForWidth(
      {
        filename: img.filename,
        base_url: img.base_url,
        width: img.width,
      },
      effectiveWidth
    ).url,
  }));

  return {
    ...photographer,
    images: processedImages,
  };
}
