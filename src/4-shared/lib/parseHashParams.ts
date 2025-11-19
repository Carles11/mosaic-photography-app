// Utility to parse hash params from URL fragment (#) into key-value pairs
export function parseHashParams(hash: string): Record<string, string> {
  // Remove any starting # or ? or / residues
  const clean = hash.replace(/^#\/?|\?/, "");
  return clean.split("&").reduce((acc, part) => {
    const [key, val] = part.split("=");
    if (key) acc[key] = decodeURIComponent(val || "");
    return acc;
  }, {} as Record<string, string>);
}
