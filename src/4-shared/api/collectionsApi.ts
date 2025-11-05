import { getBestS3FolderForWidth } from "@/4-shared/lib/getBestS3FolderForWidth";
import {
  CollectionDetail,
  CollectionDetailImage,
  CollectionWithPreview,
  PreviewImage,
} from "@/4-shared/types/collections";
import { supabase } from "./supabaseClient";

// Fetch all collections for a user, with up to 4 preview images per collection, and full imageCount
export async function fetchCollectionsForUser(
  userId: string
): Promise<CollectionWithPreview[]> {
  const { data: collectionsData, error: collectionsError } = await supabase
    .from("collections")
    .select("id, user_id, name, description, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (collectionsError) throw collectionsError;
  if (!collectionsData || collectionsData.length === 0) return [];

  const collectionIds = collectionsData.map((col) => col.id);

  if (collectionIds.length === 0) return [];

  // Get all collection_favorites for these collections
  const { data: collectionFavorites, error: favoritesError } = await supabase
    .from("collection_favorites")
    .select("collection_id, favorite_id, display_order")
    .in("collection_id", collectionIds)
    .order("display_order", { ascending: true });

  if (favoritesError) throw favoritesError;

  // Count total images per collection
  const imageCountByCollection: Record<string, number> = {};
  collectionFavorites.forEach((f) => {
    imageCountByCollection[f.collection_id] =
      (imageCountByCollection[f.collection_id] || 0) + 1;
  });

  // For preview, up to 4 favorites per collection
  const favIdsByCollection: Record<string, number[]> = {};
  const allFavoriteIds: number[] = [];
  collectionIds.forEach((cid) => {
    const favs = (collectionFavorites || [])
      .filter((f) => f.collection_id === cid)
      .slice(0, 4); // up to 4 per collection
    const favIds = favs.map((f) => f.favorite_id);
    favIdsByCollection[cid] = favIds;
    allFavoriteIds.push(...favIds);
  });

  let favoriteIdToImageId: Record<number, string> = {};
  if (allFavoriteIds.length > 0) {
    const { data: favoritesInfo, error: favoritesInfoError } = await supabase
      .from("favorites")
      .select("id, image_id")
      .in("id", allFavoriteIds);

    if (favoritesInfoError) throw favoritesInfoError;
    favoritesInfo?.forEach((fav) => {
      favoriteIdToImageId[fav.id] = fav.image_id;
    });
  }

  const allImageIds = [
    ...new Set(Object.values(favoriteIdToImageId).filter(Boolean)),
  ];

  let imageIdToPreview: Record<string, PreviewImage> = {};
  if (allImageIds.length > 0) {
    const { data: imagesData, error: imagesError } = await supabase
      .from("images_resize")
      .select(
        "id, author, title, description, created_at, base_url, filename, width, height, orientation"
      )
      .in("id", allImageIds);

    if (imagesError) throw imagesError;
    imagesData?.forEach((img) => {
      // Use the CDN helper to always get a valid, optimized preview URL (w400/webp)
      let url = "";
      if (img.base_url && img.filename) {
        url = getBestS3FolderForWidth(
          {
            width: img.width,
            filename: img.filename,
            base_url: img.base_url,
          },
          400 // Preview thumb width
        ).url;
      }
      imageIdToPreview[String(img.id)] = {
        id: img.id,
        base_url: img.base_url,
        filename: img.filename,
        url,
        author: img.author,
        title: img.title,
        description: img.description,
        created_at: img.created_at,
        width: img.width,
        height: img.height,
        orientation: img.orientation,
      };
    });
  }

  return collectionsData.map((col) => {
    const favIds = favIdsByCollection[col.id] || [];
    const previewImages: PreviewImage[] = favIds
      .map((favId) => {
        const imgId = favoriteIdToImageId[favId];
        return imageIdToPreview[imgId] || null;
      })
      .filter(Boolean) as PreviewImage[];

    return {
      ...col,
      previewImages,
      imageCount: imageCountByCollection[col.id] || 0,
    };
  });
}

// Fetch a single collection with all its images and details
export async function fetchCollectionDetail(
  collectionId: string
): Promise<CollectionDetail | null> {
  // 1. Get collection base info
  const { data: collection, error: collectionError } = await supabase
    .from("collections")
    .select("id, user_id, name, description, created_at")
    .eq("id", collectionId)
    .single();

  if (collectionError || !collection) {
    return null;
  }

  // 2. Get all collection_favorites for this collection, ordered
  const { data: cfavs, error: cfavsErr } = await supabase
    .from("collection_favorites")
    .select("favorite_id, added_at, display_order")
    .eq("collection_id", collectionId)
    .order("display_order", { ascending: true });

  if (cfavsErr) {
    return { ...collection, images: [] };
  }
  if (!cfavs || cfavs.length === 0) {
    return { ...collection, images: [] };
  }

  // 3. Get all favorite_ids and lookup image_ids
  const favoriteIds = cfavs.map((c) => c.favorite_id);

  const { data: favs, error: favsErr } = await supabase
    .from("favorites")
    .select("id, image_id")
    .in("id", favoriteIds);

  if (favsErr) {
    return { ...collection, images: [] };
  }

  const favIdToImageId: Record<number, string> = {};
  favs.forEach((f) => {
    favIdToImageId[f.id] = f.image_id;
  });

  // 4. Get all image_ids and fetch image details
  const imageIds = [...new Set(Object.values(favIdToImageId).filter(Boolean))];

  const { data: imagesData, error: imagesError } = await supabase
    .from("images_resize")
    .select(
      "id, author, title, description, created_at, base_url, filename, width, height, orientation"
    )
    .in("id", imageIds);

  if (imagesError) {
    return { ...collection, images: [] };
  }

  const imageIdToData: Record<string, any> = {};
  imagesData.forEach((img) => {
    imageIdToData[img.id] = img;
  });

  // 5. Combine all for detail list, but only include if image exists!
  const images: CollectionDetailImage[] = cfavs
    .map((cf) => {
      const imgId = favIdToImageId[cf.favorite_id];
      const img = imageIdToData[imgId];
      if (!img) {
        return null; // skip if image missing
      }
      let url = "";
      if (img.base_url && img.filename) {
        url = getBestS3FolderForWidth(
          {
            width: img.width,
            filename: img.filename,
            base_url: img.base_url,
          },
          600 // Use a sensible default for detail view, e.g. w600
        ).url;
      }
      return {
        id: imgId,
        favorite_id: cf.favorite_id,
        url,
        base_url: img.base_url,
        filename: img.filename,
        author: img.author,
        title: img.title,
        description: img.description,
        created_at: img.created_at,
        width: img.width,
        height: img.height,
        orientation: img.orientation,
        added_at: cf.added_at,
      };
    })
    .filter(Boolean) as CollectionDetailImage[]; // Only valid images

  return { ...collection, images };
}

/**
 * Fetch basic collection info for a user (id, name only).
 */
export async function fetchCollectionsBasicForUser(
  userId: string
): Promise<{ id: string; name: string }[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("id, name")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function deleteCollection(collectionId: string) {
  const { error } = await supabase
    .from("collections")
    .delete()
    .eq("id", collectionId);
  if (error) throw error;
}

// --- NEW ---

/**
 * Add a favorite to a collection.
 */
export async function addFavoriteToCollection(
  collectionId: string,
  favoriteId: number
): Promise<void> {
  const { error } = await supabase.from("collection_favorites").insert({
    collection_id: collectionId,
    favorite_id: favoriteId,
  });
  if (error) {
    // 23505 is unique violation (duplicate), for Postgres. Handle as you wish.
    if (
      error.code === "23505" ||
      (error.message && error.message.toLowerCase().includes("duplicate"))
    ) {
      throw new Error("Already in this collection!");
    }
    throw new Error("Failed to add to collection.");
  }
}

/**
 * Remove a favorite from a collection.
 */
export async function removeFavoriteFromCollection(
  collectionId: string,
  favoriteId: number
): Promise<void> {
  const { error } = await supabase
    .from("collection_favorites")
    .delete()
    .eq("collection_id", collectionId)
    .eq("favorite_id", favoriteId);
  if (error) throw error;
}
