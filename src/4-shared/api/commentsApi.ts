import { supabase } from "./supabaseClient";

import { Comment, UserCommentWithImage } from "@/4-shared/types";

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

// Fetch all comments for a user, joining image data for each comment
export async function fetchCommentsForUser(
  userId: string
): Promise<UserCommentWithImage[]> {
  // 1. Get the user's comments
  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select("id, user_id, image_id, content, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (commentsError) throw commentsError;
  if (!commentsData || commentsData.length === 0) return [];

  // 2. Get unique, non-null image IDs
  const imageIds = [
    ...new Set(
      commentsData
        .map((c) => c.image_id)
        .filter((id): id is number => id !== null && id !== undefined)
    ),
  ];

  // 3. Fetch images in bulk
  let imagesMap: Record<string, any> = {};
  if (imageIds.length > 0) {
    const { data: imagesData, error: imagesError } = await supabase
      .from("images_resize")
      .select(
        "id, base_url, filename, author, title, description, orientation, created_at, width, height, year"
      )
      .in("id", imageIds);

    if (imagesError) throw imagesError;
    if (imagesData) {
      imagesMap = imagesData.reduce((acc, img) => {
        acc[String(img.id)] = img;
        return acc;
      }, {} as Record<string, any>);
    }
  }

  // 4. Map image data onto comments
  return commentsData.map((comment) => ({
    ...comment,
    image: comment.image_id
      ? imagesMap[String(comment.image_id)] || null
      : null,
  }));
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
