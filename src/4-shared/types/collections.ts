export type PreviewImage = {
  id: string | number;
  url: string;
  base_url?: string;
  filename?: string;
  author?: string;
  title?: string;
  description?: string;
  created_at?: string;
  width?: number;
  height?: number;
  orientation?: string;
};

export type Collection = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  image_count?: number;
};

export type CollectionWithPreview = Collection & {
  previewImages: PreviewImage[];
  imageCount: number;
};

export type CollectionDetailImage = PreviewImage & {
  favorite_id: number;
  added_at?: string;
};

export type CollectionDetail = Collection & {
  images: CollectionDetailImage[];
};
