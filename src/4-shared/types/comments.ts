export type Comment = {
  id: string;
  user_id: string;
  image_id: string;
  content: string;
  created_at: string;
  user_name?: string; // Optionally hydrate with profile info
};

export type UserCommentWithImage = Comment & {
  image: {
    id: string;
    base_url: string;
    filename: string;
    author: string;
    title: string;
    description: string;
    orientation: string;
    created_at: string;
    width: number;
    height: number;
    year: number;
    photographers: {
      slug: string;
    } | null;
  } | null;
};
