import { supabase } from "@/4-shared/api/supabaseClient";
import { AffiliateProductWithAdvertiser } from "@/4-shared/types";

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
    .select("*, affiliate_advertisers(*)")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.warn("[fetchAffiliateResources] query error", error);
    return [];
  }

  const resources = (data as AffiliateProductWithAdvertiser[]).filter(
    isVisibleResource,
  );

  cachedResources = resources.slice();
  cachedAt = Date.now();
  return resources;
}
