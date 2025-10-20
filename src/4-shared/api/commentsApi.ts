import { supabase } from "./supabaseClient";

export type Comment = {
  id: string;
  user_id: string;
  image_id: string;
  content: string;
  created_at: string;
  user_name?: string; // Optionally hydrate with profile info
};

// Fetch comments for a specific image
export async function fetchCommentsForImage(
  imageId: string
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      user_id,
      image_id,
      content,
      created_at
    `
    )
    .eq("image_id", imageId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Comment[];
}

// Batch count loading for multiple images
export async function fetchCommentCountsBatch(
  imageIds: string[]
): Promise<Record<string, number>> {
  if (!imageIds.length) return {};

  const { data, error } = await supabase
    .from("comments")
    .select("image_id")
    .in("image_id", imageIds);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data ?? []).forEach(({ image_id }: { image_id: string }) => {
    counts[image_id] = (counts[image_id] ?? 0) + 1;
  });

  // Ensure all IDs are present
  imageIds.forEach((id) => {
    if (typeof counts[id] !== "number") counts[id] = 0;
  });

  return counts;
}

// Add a new comment
export async function addComment(
  imageId: string,
  userId: string,
  content: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert([{ image_id: imageId, user_id: userId, content }])
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

// Update an existing comment (only by owner)
export async function updateComment(
  commentId: string,
  userId: string,
  content: string
): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .update({ content })
    .eq("id", commentId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Comment;
}

// Delete an existing comment (only by owner)
export async function deleteComment(
  commentId: string,
  userId: string
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", userId);

  if (error) throw error;
}
