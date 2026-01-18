import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";

import { GalleryImage } from "@/4-shared/types/gallery";

const authorMap: Record<string, string> = {
  "Alfred Stieglitz": "alfred-stieglitz",
  "Baron Wilhelm Von Gloeden": "wilhelm-von-gloden",
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

type FetchMainGalleryOptions = {
  bannedTitles?: string[]; // case-insensitive substring match against title
  firstBlockSize?: number; // number of first images that must avoid male images (default 30)
};

/**
 * Fetch main gallery images.
 *
 * - nudity parameter (same as before) can be "nude" | "not-nude" | "all"
 * - options.bannedTitles: string[] (case-insensitive substring match on title). These images are removed entirely.
 * - options.firstBlockSize: number (default 30). When nudity is "nude" or "all", the first N images will not include images with gender === "male".
 */
export async function fetchMainGalleryImages(
  nudity: "nude" | "not-nude" | "all" = "not-nude",
  options: FetchMainGalleryOptions = {},
): Promise<GalleryImage[]> {
  const { bannedTitles = [], firstBlockSize = 30 } = options;

  // NOTE: include moderation in the select so we can decide to hide banned images on the client
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
      year,
      moderation
    `,
  );

  // Apply explicit DB filter only when nudity is "nude" or "not-nude".
  if (nudity === "nude" || nudity === "not-nude") {
    query = query.eq("nudity", nudity);
  }

  const { data: images, error } = await query;

  if (error || !images) {
    console.warn("Error fetching images:", error);
    return [];
  }

  const screenWidth = require("react-native").Dimensions.get("window").width;
  const pixelDensity = require("react-native").PixelRatio.get();
  const effectiveWidth = screenWidth * pixelDensity;

  // Precompute banned substrings (lowercase) for case-insensitive substring matching
  const bannedLower = (bannedTitles || []).map((t) => t.toLowerCase().trim());

  // Map DB rows to GalleryImage objects with URL, preserving original order
  const mapped: GalleryImage[] = images.map((img: any) => {
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
      effectiveWidth,
    );

    return {
      ...img,
      url,
    } as GalleryImage;
  });

  // Filter out banned titles (case-insensitive substring match against title only)
  let filtered = mapped.filter((img) => {
    if (!img.title) return true;
    const titleLower = String(img.title).toLowerCase();
    for (const banned of bannedLower) {
      if (!banned) continue;
      if (titleLower.includes(banned)) return false; // exclude this image entirely
    }
    return true;
  });

  // NEW: Filter out any image with moderation indicating it's banned.
  // We treat an image as banned if moderation?.banned?.mobile === true OR moderation?.banned?.web === true.
  filtered = filtered.filter((img) => {
    const mod = (img as any).moderation;
    if (!mod) return true;
    const bannedObj = mod.banned;
    if (!bannedObj) return true;
    // handle both boolean and string-boolean cases defensively
    const mobileBanned =
      bannedObj.mobile === true || String(bannedObj.mobile) === "true";
    const webBanned =
      bannedObj.web === true || String(bannedObj.web) === "true";
    // If any channel is banned, remove the image entirely (per your "do not show any banned image" request)
    return !(mobileBanned || webBanned);
  });

  // If nudity parameter allows nudes ("nude" or "all"), enforce first-block exclusion of male images.
  // If nudity === "not-nude", no special first-block treatment is necessary (there won't be nude images).
  const shouldExcludeMaleInFirstBlock = nudity === "nude" || nudity === "all";

  const includedIds = new Set<string>();
  const firstBlock: GalleryImage[] = [];

  if (shouldExcludeMaleInFirstBlock) {
    for (const img of filtered) {
      if (firstBlock.length >= firstBlockSize) break;
      const isMale = img.gender && String(img.gender).toLowerCase() === "male";
      if (!isMale) {
        firstBlock.push(img);
        includedIds.add(String(img.id));
      }
    }
  } else {
    // Simply take the first N images as the first block when we are in not-nude mode.
    for (let i = 0; i < Math.min(firstBlockSize, filtered.length); i++) {
      const img = filtered[i];
      firstBlock.push(img);
      includedIds.add(String(img.id));
    }
  }

  // Preserve original order for the remainder, skipping those already added to firstBlock
  const remainder = filtered.filter((img) => !includedIds.has(String(img.id)));

  // Final gallery: firstBlock followed by remainder
  const finalGallery = [...firstBlock, ...remainder];

  return finalGallery;
}
