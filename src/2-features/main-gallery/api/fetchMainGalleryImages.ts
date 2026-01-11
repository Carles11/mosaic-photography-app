import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";

import { GalleryImage } from "@/4-shared/types/gallery";

const authorMap: Record<string, string> = {
  "Alfred Stieglitz": "alfred-stieglitz",
  "Baron Wilhelm Von Gloeden": "wilhelm-von-gloeden",
  "Clarence Hudson White": "clarence-hudson-white",
  "Edward Weston": "edward-weston",
  "Eugene Durieu": "eugene-durieu",
  "Felix Jacques Moulin": "jacques-moulin",
  "Fred Holland Day": "fred-holland-day",
  "Robert Demachy": "robert-demachy",
  "Wilhelm Von Plueschow": "wilhelm-von-plueschow",
  "Jane de La Vaudère": "jane-de-la-vaudere",
  "Jane de La Vaudere": "jane-de-la-vaudere",
  "Anne Brigman": "anne-brigman",
  "Mario von Bucovich": "mario-von-bucovich",
};

function slugify(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

function authorToFolder(author: string): string {
  if (author in authorMap) {
    return authorMap[author];
  }
  return slugify(author);
}

export async function fetchMainGalleryImages(
  nudity: "nude" | "not-nude" | "all" = "not-nude"
): Promise<GalleryImage[]> {
  let query = supabase.from("images_resize").select(
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
  );

  // Apply explicit DB filter only when nudity is "nude" or "not-nude".
  if (nudity === "nude" || nudity === "not-nude") {
    query = query.eq("nudity", nudity);
  }

  const { data: images, error } = await query;

  if (error || !images) {
    console.log("Error fetching images:", error);
    return [];
  }

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  return images.map((img) => {
    const photographerFolder = authorToFolder(img.author);

    const baseUrl =
      img.base_url ||
      `https://cdn.mosaic.photography/mosaic-collections/public-domain-collection/${photographerFolder}`;

    const { url } = getBestS3FolderForWidth(
      {
        filename: img.filename,
        base_url: baseUrl,
        width: img.width,
      },
      effectiveWidth
    );

    return {
      ...img,
      url,
    };
  });
}
