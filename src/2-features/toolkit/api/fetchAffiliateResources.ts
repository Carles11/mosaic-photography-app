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
  return !EXCLUDED_ADVERTISER_NAMES.has(advertiserName.trim().toLowerCase());
}

export async function fetchAffiliateResources(): Promise<
  AffiliateProductWithAdvertiser[]
> {
  if (cachedResources && Date.now() - cachedAt < CACHE_TTL_MS) {
    return cachedResources.slice();
  }

  const { data, error } = await supabase
    .from("affiliate_products")
    .select("*, affiliate_advertisers(*)");
  // .order("featured", { ascending: false })
  // .order("sort_order", { ascending: true })
  // .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[fetchAffiliateResources] query error", error);
    return [];
  }

  const resources = (data as AffiliateProductWithAdvertiser[]).filter(
    isVisibleResource,
  );

  cachedResources = resources.slice();
  cachedAt = Date.now();

  const shuffledResources = shuffleArray(resources);

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
