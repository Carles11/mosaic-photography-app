import { supabase } from "@/4-shared/api/supabaseClient";
import { GALLERY_FIRST_BLOCK } from "@/4-shared/constants/gallery";
import { authorToFolder, canonicalSlugMap } from "@/4-shared/lib/authorSlug";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import * as Sentry from "@sentry/react-native";

import { GalleryImage } from "@/4-shared/types";

type FetchMainGalleryOptions = {
  bannedTitles?: string[]; // case-insensitive substring match against title
  firstBlockSize?: number; // number of first images that must avoid male images (default: GALLERY_FIRST_BLOCK)
};

// Module-level cache & logging helpers
let _cachedAuthorSlugMap: Record<string, string> = {};
let _cachedAuthorSlugMapUpdatedAt = 0;
const AUTHOR_SLUG_CACHE_TTL = 1000 * 60 * 5; // 5 minutes

// Keep track of which authors we've already reported as missing to avoid Sentry/log spam.
const _loggedMissingAuthors = new Set<string>();

/**
 * Fetch main gallery images.
 *
 * - nudity parameter (same as before) can be "nude" | "not-nude" | "all"
 * - options.bannedTitles: string[] (case-insensitive substring match on title). These images are removed entirely.
 * - options.firstBlockSize: number (default: GALLERY_FIRST_BLOCK). When nudity is "nude" or "all", the first N images will not include images with gender === "male".
 */
export async function fetchMainGalleryImages(
  nudity: "nude" | "not-nude" | "all" = "not-nude",
  options: FetchMainGalleryOptions = {},
): Promise<GalleryImage[]> {
  const { bannedTitles = [], firstBlockSize = GALLERY_FIRST_BLOCK } = options;

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
  filtered = filtered.filter((img) => {
    const mod = (img as any).moderation;
    if (!mod) return true;
    const bannedObj = mod.banned;
    if (!bannedObj) return true;
    const mobileBanned =
      bannedObj.mobile === true || String(bannedObj.mobile) === "true";
    const webBanned =
      bannedObj.web === true || String(bannedObj.web) === "true";
    return !(mobileBanned || webBanned);
  });

  const daySeed = new Date().toISOString().slice(0, 10).replace(/-/g, "");

  const xmur3 = (str: string) => {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  };

  const mulberry32 = (a: number) => {
    return () => {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  const seededShuffle = <T>(arr: T[], seedStr: string) => {
    const arrCopy = [...arr];
    const seedFn = xmur3(seedStr);
    const rand = mulberry32(seedFn());

    for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
    }

    return arrCopy;
  };

  const shuffled = seededShuffle(
    filtered,
    `${daySeed}:${nudity}:${filtered.length}`,
  );

  // --- NEW: fetch photographer slugs for the distinct authors present in `filtered` ---
  // Normalize author keys (trim) to avoid whitespace mismatches.
  const authors = Array.from(
    new Set(
      filtered
        .map((f: any) => (f.author ? String(f.author).trim() : ""))
        .filter(Boolean) as string[],
    ),
  );

  // If cache expired, reset it
  if (Date.now() - _cachedAuthorSlugMapUpdatedAt > AUTHOR_SLUG_CACHE_TTL) {
    _cachedAuthorSlugMap = {};
    _cachedAuthorSlugMapUpdatedAt = 0;
  }

  // Find which authors we still need to fetch
  const authorsToFetch = authors.filter((a) => !(a in _cachedAuthorSlugMap));

  if (authorsToFetch.length > 0) {
    try {
      // bulk lookup: get author->slug mapping from photographers table for only missing authors
      const { data: photRows, error: photError } = await supabase
        .from("photographers")
        .select("author, slug")
        .in(
          "author",
          authorsToFetch.map((a) => a),
        );

      if (photError) {
        console.warn("Error fetching photographer slugs:", photError);
      } else if (photRows) {
        photRows.forEach((p: any) => {
          if (p && p.author)
            _cachedAuthorSlugMap[String(p.author).trim()] = p.slug;
        });
        _cachedAuthorSlugMapUpdatedAt = Date.now();
      }
    } catch (e) {
      console.warn("Failed to fetch photographer slugs:", e);
    }
  }

  // Attach photographerSlug to each filtered image.
  // IMPORTANT: do NOT fallback to slugify here. If DB slug is missing, set undefined and log so the import pipeline can be fixed.
  filtered.forEach((img: any) => {
    const authorKey = img.author ? String(img.author).trim() : "";
    if (authorKey && _cachedAuthorSlugMap[authorKey]) {
      img.photographerSlug = _cachedAuthorSlugMap[authorKey];
    } else if (authorKey && canonicalSlugMap[authorKey]) {
      // Keep the canonical map as a temporary emergency fallback (non-authoritative).
      img.photographerSlug = canonicalSlugMap[authorKey];
      // Only report this fallback once per author to avoid spamming Sentry.
      if (!_loggedMissingAuthors.has(authorKey)) {
        _loggedMissingAuthors.add(authorKey);
        Sentry.captureMessage(
          `[photographerSlug fallback] Used canonicalSlugMap for author: ${authorKey}, slug: ${img.photographerSlug}`,
        );
      }
    } else if (authorKey) {
      // No slug found — do not generate slug using slugify. Log for data pipeline fix once per author.
      img.photographerSlug = undefined;
      if (!_loggedMissingAuthors.has(authorKey)) {
        _loggedMissingAuthors.add(authorKey);
        Sentry.captureMessage(
          `[photographerSlug missing] No DB slug for author: ${authorKey}. Recommend updating import pipeline to include photographer slug.`,
        );
        console.debug(
          `[fetchMainGalleryImages] No slug found for author: ${authorKey}`,
        );
      }
    } else {
      img.photographerSlug = undefined;
    }
  });

  // If nudity parameter allows nudes ("nude" or "all"), enforce first-block exclusion of male images.
  const shouldExcludeMaleInFirstBlock = nudity === "nude" || nudity === "all";

  const includedIds = new Set<string>();
  const firstBlock: GalleryImage[] = [];

  if (shouldExcludeMaleInFirstBlock) {
    for (const img of shuffled) {
      if (firstBlock.length >= firstBlockSize) break;
      const isMale = img.gender && String(img.gender).toLowerCase() === "male";
      if (!isMale) {
        firstBlock.push(img);
        includedIds.add(String(img.id));
      }
    }
  } else {
    for (let i = 0; i < Math.min(firstBlockSize, shuffled.length); i++) {
      const img = shuffled[i];
      firstBlock.push(img);
      includedIds.add(String(img.id));
    }
  }

  const remainder = shuffled.filter((img) => !includedIds.has(String(img.id)));
  const finalGallery = [...firstBlock, ...remainder];

  return finalGallery;
}
