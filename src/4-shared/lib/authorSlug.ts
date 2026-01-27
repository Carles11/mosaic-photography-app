// Canonical photographer slugs for navigation/DB (author -> canonical URL slug)
export const canonicalSlugMap: Record<string, string> = {
  "Alfred Stieglitz": "stieglitz",
  "Baron Wilhelm Von Gloeden": "von-gloeden",
  "Clarence Hudson White": "hudson-white",
  "Edward Weston": "weston",
  "Eugene Durieu": "durieu",
  "Felix Jacques Moulin": "moulin",
  "Fred Holland Day": "holland-day",
  "Robert Demachy": "demachy",
  "Wilhelm Von Plueschow": "von-plueschow",
  "Jane de La Vaudère": "de-la-vaudere",
  "Jane de La Vaudere": "de-la-vaudere",
  "Anne Brigman": "brigman",
  "Mario von Bucovich": "von-bucovich",
};

// Author -> folder name mapping (used to build S3 folder names).
// This list is authoritative for folder naming. Prefer adding new authors
// here when their folder name differs from the canonical URL slug.
export const authorMap: Record<string, string> = {
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

/**
 * sanitizeForFolder
 * - Normalizes the author string to a safe folder name.
 * - Removes diacritics, converts to lowercase, replaces non-alphanumeric groups with single hyphens,
 *   trims leading/trailing hyphens.
 *
 * Examples:
 *  "Anne Brigman" -> "anne-brigman"
 *  "Clarence Hudson White" -> "clarence-hudson-white"
 *  "Jane de La Vaudère" -> "jane-de-la-vaudere"
 */
export function sanitizeForFolder(text: string): string {
  if (!text) return "";
  const normalized = text
    .normalize("NFKD")
    // Remove diacritics
    .replace(/[\u0300-\u036f]/g, "")
    // Lowercase
    .toLowerCase()
    // Replace any sequence of non-alphanumeric characters with a single hyphen
    .replace(/[^a-z0-9]+/g, "-")
    // Trim leading/trailing hyphens
    .replace(/^-+|-+$/g, "");
  return normalized;
}

/**
 * getFolderName(author)
 * - Preferred helper to build the S3 folder name for an author.
 * - Uses authorMap when available (authorMap is authoritative for folder names).
 * - Otherwise falls back to sanitizeForFolder(author).
 */
export function getFolderName(author: string): string {
  if (!author) return "";
  const key = String(author).trim();
  if (key in authorMap) return authorMap[key];
  // If canonicalSlugMap exists but authorMap does not, we still prefer a
  // folder derived from the original author string rather than the canonical URL slug.
  const folder = sanitizeForFolder(key);
  // Optionally log or capture (Sentry) here if you want telemetry for missing authorMap entries.
  return folder;
}

/**
 * getCanonicalSlug(author)
 * - Returns the canonical URL slug for an author when available in canonicalSlugMap.
 * - Returns undefined when no canonical slug exists (caller should rely on DB-provided slug instead).
 *
 * IMPORTANT: Do NOT use this function to auto-generate canonical slugs for URLs in production;
 * the source-of-truth for URL slugs must be the DB (photographers.slug). This helper is only
 * a convenience for known exceptions.
 */
export function getCanonicalSlug(author: string): string | undefined {
  if (!author) return undefined;
  const key = String(author).trim();
  return canonicalSlugMap[key];
}

/**
 * slugify (DEPRECATED for URL slugs)
 * - Kept for backward compatibility in places that used the old helper for folder names.
 * - WARNING: Do not use for constructing URL slugs. Use getCanonicalSlug (DB) or the canonicalSlugMap.
 * - This function currently delegates to sanitizeForFolder.
 */
export function slugify(text: string): string {
  // Minimal console warning to surface accidental misuse during dev/debug.
  if (
    typeof console !== "undefined" &&
    process?.env?.NODE_ENV !== "production"
  ) {
    console.warn(
      "[slugify] DEPRECATED for URL slugs. Use getCanonicalSlug(author) for URL slugs and getFolderName(author) for folder names.",
    );
  }
  return sanitizeForFolder(text);
}

/**
 * authorToFolder(author)
 * - Backwards-compatible helper used by some code paths to obtain folder names.
 * - Internally delegates to getFolderName.
 */
export function authorToFolder(author: string): string {
  return getFolderName(author);
}
