import { supabase } from "@/4-shared/api/supabaseClient";

const BUCKET = "avatars";

export async function uploadAvatar(
  userId: string,
  localUri: string,
): Promise<string> {
  const path = `${userId}/avatar.jpg`;

  // Only change: Force refresh the session before the upload
  const { error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;

  const formData = new FormData();
  formData.append("file", {
    uri: localUri,
    name: "avatar.jpg",
    type: "image/jpeg",
  } as any);

  const { error } = await supabase.storage.from(BUCKET).upload(path, formData, {
    contentType: "image/jpeg",
    upsert: true,
  });
  console.log({ error });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  console.log({ publicUrl: data?.publicUrl });
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteAvatar(userId: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${userId}/avatar.jpg`]);
  if (error) throw error;
}
