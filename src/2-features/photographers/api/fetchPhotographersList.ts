import { supabase } from "@/4-shared/api/supabaseClient";
import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import { Dimensions } from "react-native";

import { PhotographerListItem } from "@/4-shared/types";

export async function fetchPhotographersList(): Promise<
  PhotographerListItem[]
> {
  // Step 1: Fetch all photographers
  const { data: photographers, error: photographerError } = await supabase
    .from("photographers")
    .select("id, name, surname, slug, author")
    .order("surname");

  if (photographerError || !photographers) return [];

  // Step 2: Extract all author fields
  const authors = photographers.map((p) => p.author);

  // Step 3: Fetch all portrait images for those authors in one query
  const { data: portraitImages, error: imagesError } = await supabase
    .from("images_resize")
    .select("author, filename, base_url, width")
    .in("author", authors)
    .ilike("filename", "000_aaa%");

  // Step 4: Build a map for quick lookup
  const portraitMap = new Map();
  if (portraitImages) {
    for (const img of portraitImages) {
      if (img.author && !portraitMap.has(img.author)) {
        portraitMap.set(img.author, img);
      }
    }
  }

  const deviceWidth = Dimensions.get("window").width;

  // Step 5: Build the result list
  return photographers.map((photographer: any) => {
    const img = portraitMap.get(photographer.author);
    let portrait = "";
    if (img) {
      const best = getBestS3FolderForWidth(
        {
          filename: img.filename,
          base_url: img.base_url,
          width: img.width,
        },
        deviceWidth
      );
      portrait = best.url;
    }

    return {
      id: photographer.id,
      name: photographer.name,
      surname: photographer.surname,
      slug: photographer.slug,
      portrait,
    };
  });
}
