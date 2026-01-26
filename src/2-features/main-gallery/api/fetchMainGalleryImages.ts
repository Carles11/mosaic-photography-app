import { supabase } from "@/4-shared/api/supabaseClient";
import {
  authorToFolder,
  canonicalSlugMap,
  slugify,
} from "@/4-shared/lib/authorSlug";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import * as Sentry from "@sentry/react-native";

import { GalleryImage } from "@/4-shared/types/gallery";

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

  // --- NEW: fetch photographer slugs for the distinct authors present in `filtered` ---
  const authors = Array.from(
    new Set((filtered.map((f: any) => f.author) as string[]).filter(Boolean)),
  );

  const authorSlugMap: Record<string, string> = {};

  if (authors.length > 0) {
    try {
      // bulk lookup: get author->slug mapping from photographers table
      const { data: photRows, error: photError } = await supabase
        .from("photographers")
        .select("author, slug")
        .in("author", authors);

      if (photError) {
        console.warn("Error fetching photographer slugs:", photError);
      } else if (photRows) {
        photRows.forEach((p: any) => {
          if (p && p.author) authorSlugMap[p.author] = p.slug;
        });
      }
    } catch (e) {
      console.warn("Failed to fetch photographer slugs:", e);
    }
  }

  // Attach photographerSlug to each filtered image. If no DB slug found, fall back to a slugify fallback.
  filtered.forEach((img: any) => {
    if (img.author && authorSlugMap[img.author]) {
      img.photographerSlug = authorSlugMap[img.author];
    } else if (img.author && canonicalSlugMap[img.author]) {
      img.photographerSlug = canonicalSlugMap[img.author];
      Sentry.captureMessage(
        `[photographerSlug fallback] Used canonicalSlugMap for author: ${img.author}, slug: ${img.photographerSlug}`,
      );
    } else if (img.author) {
      img.photographerSlug = slugify(img.author);
      Sentry.captureMessage(
        `[photographerSlug fallback] Used slugify for author: ${img.author}, slug: ${img.photographerSlug}`,
      );
    } else {
      img.photographerSlug = undefined;
    }
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
