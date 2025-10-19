import { supabase } from "./supabaseClient";

// Get all favorite image IDs for a user
export async function getUserFavorites(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("image_id")
    .eq("user_id", userId);
  if (error) throw error;
  // Convert numeric image_id to string for consistent state management
  return data?.map((fav: { image_id: number }) => String(fav.image_id)) ?? [];
}

// Add a favorite for a user
export async function addFavorite(
  userId: string,
  imageId: string | number
): Promise<void> {
  const numericId =
    typeof imageId === "string" ? parseInt(imageId, 10) : imageId;
  const { error } = await supabase
    .from("favorites")
    .insert([{ user_id: userId, image_id: numericId }]);
  if (error) throw error;
}

// Remove a favorite for a user
export async function removeFavorite(
  userId: string,
  imageId: string | number
): Promise<void> {
  const numericId =
    typeof imageId === "string" ? parseInt(imageId, 10) : imageId;
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("image_id", numericId);
  if (error) throw error;
}
