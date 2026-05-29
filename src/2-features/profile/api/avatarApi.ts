import { supabase } from "@/4-shared/api/supabaseClient";

const BUCKET = "avatars";

export async function uploadAvatar(
  userId: string,
  localUri: string,
): Promise<string> {
  const path = `${userId}/avatar.jpg`;

  // React Native can't fetch() a local file:// URI directly.
  // Use FormData which the RN runtime handles natively.
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

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return `${data.publicUrl}?t=${Date.now()}`;
}

export async function deleteAvatar(userId: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([`${userId}/avatar.jpg`]);
  if (error) throw error;
}
