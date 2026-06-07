import { supabase } from "@/4-shared/api/supabaseClient";
import { getAllS3Urls } from "@/4-shared/lib/getAllS3Urls";
import type { Contributor, ContributorImage } from "@/4-shared/types";

export type ContributorWithFeatured = Contributor & {
  featuredImage: ContributorImage | null;
};

export async function fetchContributorsList(): Promise<
  ContributorWithFeatured[]
> {
  const { data: contributors, error } = await supabase
    .from("contributors")
    .select("*")
    .order("name", { ascending: true });

  if (error || !contributors) {
    console.warn("[fetchContributorsList] error", error);
    return [];
  }

  const { data: allImages } = await supabase
    .from("contributor_images")
    .select("*")
    .in(
      "contributor_id",
      contributors.map((c) => c.id),
    )
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const grouped: Record<string, typeof allImages> = {};
  for (const img of allImages ?? []) {
    if (!grouped[img.contributor_id]) grouped[img.contributor_id] = [];
    grouped[img.contributor_id].push(img);
  }

  const withFeatured: ContributorWithFeatured[] = contributors.map(
    (contributor) => {
      const imgs = grouped[contributor.id] ?? [];
      const img = imgs.find((i) => i.featured) ?? imgs[0];

      if (!img) return { ...contributor, featuredImage: null };

      const featuredImage: ContributorImage = {
        ...img,
        id: img.image_id,
        author: contributor.name,
        s3Progressive: getAllS3Urls(img),
      };

      return { ...contributor, featuredImage };
    },
  );

  return withFeatured;
}
