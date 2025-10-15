import { supabase } from '@/4-shared/api/supabaseClient';
import { getOptimizedImageUrl } from '@/4-shared/lib/getOptimizedImageUrl';
import { GalleryImage, GalleryImageWithPhotographer } from '@/4-shared/types/gallery';

export async function fetchMainGalleryImages(): Promise<GalleryImage[]> {
  const { data: images, error } = await supabase
    .from('images_resize')
    .select(`
      id,
      base_url,
      filename,
      author,
      title,
      description,
      created_at,
      orientation,
      width,
      height,
      print_quality,
      gender,
      color,
      nudity,
      year,
      photographers (
        slug
      )
    `)
    .eq('nudity', 'not-nude');


  if (error || !images) {
    console.log('Error fetching images:', error);
    return [];
  }

  // Use shared type and safe mapping for slug
  return (images as GalleryImageWithPhotographer[]).map(img => ({
    ...img,
    url: getOptimizedImageUrl({
  photographerFolder: img.photographers?.slug || '',
      filename: img.filename,
    }),
  }));
}