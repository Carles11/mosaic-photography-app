 
export type Photographer = {
  id: string | number;
  name: string;
  surname: string;
  origin: string;
  birthdate?: string;
  deceasedate?: string;
  equipment?: string[];
  biography?: string;
  author: string;
  website?: string;
  store?: string[];
  instagram?: string;
  random_order?: number;
  slug?: string;
  intro?: string;
};

export type GalleryImage = {
  id: string;
  base_url: string;
  filename: string;
  author: string;
  title: string;
  description: string;
  created_at: string;
  orientation: string;
  width: number;
  height: number;
  print_quality?: string;
  gender?: string;
  color?: string;
  nudity?: string;
  year?: number;
  url: string;
  mosaicType?: 'normal' | 'large' | 'wide' | 'tall';
};

export type GalleryImageWithPhotographer = GalleryImage & {
  photographers?: Photographer[];
};

export type GalleryProps = {
  images: GalleryImage[];
};

export type MainGalleryProps = {
  images: GalleryImage[];
  loading?: boolean;
  error?: string;
};