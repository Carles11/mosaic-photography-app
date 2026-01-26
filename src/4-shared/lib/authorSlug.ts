// Canonical photographer slugs for navigation/DB (not for folders)
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
// THIS HELPS CREATE THE FOLDER NAMES FOR AUTHORS IN fetchMainGalleryImages;
// NOT TO BE CONFUSED WITH PHOTOGRAPHER SLUGS USED IN URLS

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

export function slugify(text: string): string {
  // Exact DB slugs from supabase photographers table
  const dbSlugs: Record<string, string> = {
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
  if (text in dbSlugs) {
    console.debug(`[slugify] using DB slug for '${text}': ${dbSlugs[text]}`);
    return dbSlugs[text];
  }
  // fallback: generic slugify
  const fallback = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  console.debug(`[slugify] fallback for '${text}': ${fallback}`);
  return fallback;
}

export function authorToFolder(author: string): string {
  if (!author) return "";
  if (author in authorMap) {
    const folder = authorMap[author];
    return folder;
  }
  if (author in canonicalSlugMap) {
    const folder = canonicalSlugMap[author];

    return folder;
  }
  const fallback = slugify(author);

  return fallback;
}
