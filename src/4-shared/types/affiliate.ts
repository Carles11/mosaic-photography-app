export type LocalizedText = Record<string, string | null | undefined>;

export type AffiliateAdvertiser = {
  id: string;
  name: string;
  slug: string;
  platform: string;
  logo_url?: string | null;
  description?: string | null;
  website_url?: string | null;
  header_url?: string | null;
  banner_image_url?: string | null;
  promo_url?: string | null;
  banner_link_url?: string | null;
  editorial_note?: LocalizedText | null;
  template?: string | null;
  created_at?: string;
};

export type AffiliateProduct = {
  id: string;
  advertiser_id: string;
  type: string;
  title: LocalizedText;
  description?: LocalizedText | null;
  affiliate_url: string;
  image_url?: string | null;
  photographer_author?: string | null;
  created_at?: string;
  featured?: boolean;
  sort_order?: number;
  advertiser_name?: string | null;
};

export type AffiliateProductWithAdvertiser = AffiliateProduct & {
  affiliate_advertisers: AffiliateAdvertiser | null;
};

export type AffiliateAdvertiserWithProducts = AffiliateAdvertiser & {
  products?: AffiliateProduct[];
};

export type AffiliateResourceFilter =
  | "all"
  | "tool"
  | "framing"
  | "book"
  | "print";
