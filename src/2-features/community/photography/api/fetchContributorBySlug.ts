import { supabase } from "@/4-shared/api/supabaseClient";
import { getAllS3Urls } from "@/4-shared/lib/getAllS3Urls";
import type { Contributor, ContributorImage } from "@/4-shared/types";

export type ContributorWithImages = Contributor & {
  images: ContributorImage[];
  featuredImage: ContributorImage | null;
};

export async function fetchContributorBySlug(
  slug: string,
): Promise<ContributorWithImages | null> {
  const { data: contributor, error: cErr } = await supabase
    .from("contributors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (cErr || !contributor) {
    console.warn("[fetchContributorBySlug] error", cErr);
    return null;
  }

  const { data: imgs } = await supabase
    .from("contributor_images")
    .select("*")
    .eq("contributor_id", contributor.id)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const mappedImages: ContributorImage[] = (imgs ?? []).map((img) => ({
    ...img,
    id: img.image_id,
    author: contributor.name,
    s3Progressive: getAllS3Urls(img),
  }));

  const featuredImage =
    mappedImages.find((img) => img.featured) ?? mappedImages[0] ?? null;

  return { ...contributor, images: mappedImages, featuredImage };
}
