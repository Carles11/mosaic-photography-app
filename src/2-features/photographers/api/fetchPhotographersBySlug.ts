import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import type { PhotographerSlug } from "@/4-shared/types";

/**
 * @param slug photographer slug
 * @param nudity "not-nude" | "nude" | "all" (default "not-nude")
 */
export async function fetchPhotographerBySlug(
  slug: string,
  nudity: "nude" | "not-nude" | "all" = "not-nude"
): Promise<PhotographerSlug | null> {
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

  // Apply explicit DB filter only when nudity is "nude" or "not-nude"
  if (nudity === "nude" || nudity === "not-nude") {
    imagesQuery = imagesQuery.eq("nudity", nudity);
  }

  const { data: imagesForAuthor, error: imagesError } = await imagesQuery;

  // Portrait files 000_aaa_... are always included (any nudity)
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

  if (imagesError || portraitError) {
    console.log(
      "Error fetching photographer images:",
      imagesError || portraitError
    );
  }

  const allMap: Record<string, any> = {};
  (imagesForAuthor ?? []).forEach((img) => (allMap[img.id] = img));
  (portraitImages ?? []).forEach((img) => (allMap[img.id] = img));
  const allImages = Object.values(allMap);

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  const processed = allImages.map((img) => ({
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
    images: processed,
  };
}
