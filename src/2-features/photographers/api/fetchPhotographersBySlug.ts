import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import type { PhotographerSlug } from "@/4-shared/types";

/**
 * @param slug photographer slug
 * @param nudity "not-nude" | "nude" | "all" (default "not-nude")
 */
export async function fetchPhotographerBySlug(
  slug: string,
  nudity: "nude" | "not-nude" | "all" = "not-nude",
): Promise<PhotographerSlug | null> {
  const { data: photographer, error: photographerError } = await supabase
    .from("photographers")
    .select(
      `
      id, name, surname, slug, origin, biography, birthdate, deceasedate, website, store, author
    `,
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
      year,
      moderation
    `,
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
      year,
      moderation
    `,
    )
    .eq("author", photographer.author)
    .ilike("filename", "000_aaa_%");

  if (imagesError || portraitError) {
    console.log(
      "Error fetching photographer images:",
      imagesError || portraitError,
    );
  }

  const allMap: Record<string, any> = {};
  (imagesForAuthor ?? []).forEach((img) => (allMap[img.id] = img));
  (portraitImages ?? []).forEach((img) => (allMap[img.id] = img));
  const allImages = Object.values(allMap);

  // Filter out banned images (client-side). Treat an image as banned if moderation?.banned?.mobile === true
  // OR moderation?.banned?.web === true. Defensive checks accept boolean or string values.
  const nonBannedImages = allImages.filter((img: any) => {
    const mod = img?.moderation;
    if (!mod) return true;
    const bannedObj = mod.banned;
    if (!bannedObj) return true;
    const mobileBanned =
      bannedObj.mobile === true || String(bannedObj.mobile) === "true";
    const webBanned =
      bannedObj.web === true || String(bannedObj.web) === "true";
    return !(mobileBanned || webBanned);
  });

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  const processed = nonBannedImages.map((img: any) => ({
    ...img,
    url: getBestS3FolderForWidth(
      {
        filename: img.filename,
        base_url: img.base_url,
        width: img.width,
      },
      effectiveWidth,
    ).url,
  }));

  return {
    ...photographer,
    images: processed,
  };
}
