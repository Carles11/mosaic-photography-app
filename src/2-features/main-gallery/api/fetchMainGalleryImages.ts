import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";

import { GalleryImage } from "@/4-shared/types/gallery";

// Author display name to S3 folder mapping
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
  "Jane de La Vaudère": "jane-de-la-vaudere", // alternate accent spelling
  "Jane de La Vaudere": "jane-de-la-vaudere",
  "Anne Brigman": "anne-brigman",
  "Mario von Bucovich": "mario-von-bucovich",
  // Add more as needed
};

function slugify(text: string): string {
  // Remove accents, convert to ASCII, lowercase and replace spaces with hyphens
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9 ]/g, "") // Remove non-alphanumeric except spaces
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

export async function fetchMainGalleryImages(): Promise<GalleryImage[]> {
  const { data: images, error } = await supabase
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
    .eq("nudity", "not-nude");

  if (error || !images) {
    console.log("Error fetching images:", error);
    return [];
  }

  // Use device screen width for optimal image size selection
  // If you want to use actual rendered width, pass it in from your component instead of using screenWidth here.
  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  // Synchronous, performant mapping using S3 logic
  return images.map((img) => {
    const photographerFolder = authorToFolder(img.author);

    // Construct base_url if not present (fallback to full CDN path)
    // If your base_url is always present and correct in Supabase, you can omit this fallback logic.
    const baseUrl =
      img.base_url ||
      `https://cdn.mosaic.photography/mosaic-collections/public-domain-collection/${photographerFolder}`;

    const { url } = getBestS3FolderForWidth(
      {
        width: img.width,
        filename: img.filename,
        base_url: baseUrl,
      },
      effectiveWidth
    );

    return {
      ...img,
      url,
    };
  });
}
