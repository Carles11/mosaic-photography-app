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
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
}

export function authorToFolder(author: string): string {
  if (!author) return "";
  if (author in authorMap) {
    return authorMap[author];
  }
  return slugify(author);
}
