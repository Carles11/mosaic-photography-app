import { supabase } from "@/4-shared/api/supabaseClient";
import { shuffleArray } from "@/4-shared/helpers/shuffle";

import {
  AffiliateAdvertiserWithProducts,
  AffiliateProductWithAdvertiser,
} from "@/4-shared/types";

const EXCLUDED_ADVERTISER_NAMES = new Set(["fine art america"]);

let cachedResources: AffiliateProductWithAdvertiser[] | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 5;

function isVisibleResource(product: AffiliateProductWithAdvertiser) {
  const advertiserName =
    product.affiliate_advertisers?.name ?? product.advertiser_name ?? "";
  // temporary disabled until awin program joining confirms
  return !EXCLUDED_ADVERTISER_NAMES.has(advertiserName.trim().toLowerCase());
}

export async function fetchAffiliateResources(): Promise<
  AffiliateProductWithAdvertiser[]
> {
  if (cachedResources && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedResources.slice();
  }

  // `!inner` turns the join into a filter: products of a hidden partner are
  // dropped, as are hidden products. Without this the app kept showing the 25
  // Amazon products after the website hid them - links to a terminated account
  // that earn nothing.
  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*, affiliate_advertisers!inner(*)")
    .eq("is_active", true)
    .eq("affiliate_advertisers.is_active", true);

  if (error || !data) {
    console.warn("[fetchAffiliateResources] query error", error);
    return [];
  }

  const resources = (data as AffiliateProductWithAdvertiser[]).filter(
    isVisibleResource,
  );

  const shuffledResources = shuffleArray(resources);

  cachedResources = shuffledResources.slice();
  cachedAt = Date.now();

  return shuffledResources;
}

export async function fetchToolkitDataBySlug(
  slug: string,
): Promise<AffiliateAdvertiserWithProducts | null> {
  const { data, error } = await supabase
    .from("affiliate_advertisers")
    .select(
      `
      *,
      products:affiliate_products(*)
    `,
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .eq("products.is_active", true)
    .single();

  if (error || !data) {
    console.warn("[fetchToolkitDataBySlug] query error", error);
    return null;
  }

  const advertiser = data as AffiliateAdvertiserWithProducts;
  advertiser.products = [...(advertiser.products ?? [])].sort((a, b) => {
    const featuredDelta =
      Number(b.featured ?? false) - Number(a.featured ?? false);
    if (featuredDelta !== 0) return featuredDelta;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return advertiser;
}

/**
 * Products tied to one photographer, for their detail screen.
 *
 * Fine Art America is NOT excluded here, unlike the home shelf: those prints
 * are of that photographer's own work and belong on their page. They stay
 * untracked until the Awin application is approved, but they are still the
 * most relevant thing we can offer.
 */
export async function fetchAffiliateProductsByAuthor(
  author: string,
): Promise<AffiliateProductWithAdvertiser[]> {
  if (!author) return [];

  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*, affiliate_advertisers!inner(*)")
    .eq("photographer_author", author)
    .eq("is_active", true)
    .eq("affiliate_advertisers.is_active", true);

  if (error || !data) {
    console.warn("[fetchAffiliateProductsByAuthor] query error", error);
    return [];
  }

  // A print of the work being looked at is the nearest thing to what the
  // visitor already wants; then a book containing it.
  const TYPE_RANK: Record<string, number> = {
    print: 0,
    framing: 1,
    book: 2,
    tool: 3,
  };

  return (data as AffiliateProductWithAdvertiser[]).sort(
    (a, b) =>
      (TYPE_RANK[a.type] ?? 8) - (TYPE_RANK[b.type] ?? 8) ||
      Number(Boolean(b.featured)) - Number(Boolean(a.featured)) ||
      (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );
}
