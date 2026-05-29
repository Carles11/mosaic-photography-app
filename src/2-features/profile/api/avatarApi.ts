import { supabase } from "@/4-shared/api/supabaseClient";

const BUCKET = "avatars";

/**
 * Upload a local file URI to Supabase Storage under avatars/{userId}/avatar.jpg
 * Returns the public URL of the uploaded file.
 */
export async function uploadAvatar(
  userId: string,
  localUri: string,
): Promise<string> {
  // Fetch the file as a blob
  const response = await fetch(localUri);
  const blob = await response.blob();

  const path = `${userId}/avatar.jpg`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: "image/jpeg",
    upsert: true, // overwrite existing avatar
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Bust cache by appending a timestamp so the new image loads immediately
  return `${data.publicUrl}?t=${Date.now()}`;
}

/**
 * Delete the user's avatar from storage.
 */
export async function deleteAvatar(userId: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${userId}/avatar.jpg`]);
  if (error) throw error;
}
