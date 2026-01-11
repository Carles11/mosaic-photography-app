import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import type { PhotographerSlug } from "@/4-shared/types";

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

  // 2. Fetch all not-nude images for this photographer
  const { data: notNudeImages, error: notNudeError } = await supabase
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
  // .eq("nudity", "not-nude");

  // 3. Fetch all 000_aaa_ portrait images for this photographer (any nudity)
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

  // 4. Combine, removing duplicates by id
  const allImagesMap: Record<string, any> = {};
  (notNudeImages ?? []).forEach((img) => {
    allImagesMap[img.id] = img;
  });
  (portraitImages ?? []).forEach((img) => {
    allImagesMap[img.id] = img;
  });
  const allImages = Object.values(allImagesMap);

  // Use device screen width for optimal image size selection
  // If you want to use actual rendered width, pass it in from your component instead of using screenWidth here.
  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  // 5. Map images to use the best available resolution in the CDN
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
    // 🚫 DO NOT overwrite width here – keep original width!
  }));

  return {
    ...photographer,
    images: processedImages,
  };
}
