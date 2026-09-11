/**
 * Affiliate URLs come from the same Supabase tables the website uses, and some
 * of them are site-relative rather than absolute: the TASCHEN rows store
 * `/api/go/taschen?u=...&ref=...`, a route on mosaic.photography that picks the
 * visitor's Awin programme and redirects to it.
 *
 * On the web a relative URL just works. Here it does not. expo-web-browser
 * rejects anything without a scheme, which is why the card reported "Could not
 * open this resource", and the naive fallback
 * `startsWith("http") ? url : "https://" + url` turns "/api/go/taschen" into
 * "https:///api/go/taschen" - a malformed URL, which is worse than an error.
 *
 * Resolving here rather than storing absolute URLs in the database keeps the
 * country routing and the per-product click tracking intact: the app goes
 * through exactly the same router the website does.
 */
const SITE_ORIGIN = "https://www.mosaic.photography";

export function resolveAffiliateUrl(url?: string | null): string | null {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Already absolute and safe to hand to a browser.
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  // Protocol-relative.
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  // Site-relative: resolve against the website.
  if (trimmed.startsWith("/")) return `${SITE_ORIGIN}${trimmed}`;

  // A bare host such as "example.com/thing".
  if (/^[\w-]+(\.[\w-]+)+(\/|$)/.test(trimmed)) return `https://${trimmed}`;

  // Anything else (mailto:, javascript:, app schemes) is not ours to open.
  return null;
}
