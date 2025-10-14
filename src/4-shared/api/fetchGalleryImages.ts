import { GalleryImage } from '@/4-shared/types';
import { supabase } from './supabaseClient';


/**
 * Fetches gallery images and applies mosaicType logic.
 * Mirrors the web's SSR function for mobile.
 */
export async function fetchGalleryImages(): Promise<GalleryImage[] | null> {
  try {
    const { data: images, error } = await supabase
      .from('images_resize')
      .select(
        'id, base_url, filename, author, title, description, created_at, orientation, width, height, print_quality, gender, color, nudity, year'
      );

    if (error || !images) {
      console.error('[fetchGalleryImages] Supabase error or no data', error);
      return null;
    }

    // Compose image URL from base_url and filename
    const imagesWithUrl = images.map((img) => ({
      ...img,
      url: img.base_url.endsWith('/')
        ? img.base_url + img.filename
        : img.base_url + '/' + img.filename,
    }));

    // Filter out images starting with 000_aaa
    const filteredImages = imagesWithUrl.filter((img) => {
      const fileName = img.filename.toLowerCase();
      return !fileName.startsWith('000_aaa');
    });

    // Shuffle for random order (Fisher-Yates)
    const shuffledImages = [...filteredImages];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    // Apply mosaicType logic
    const processedImages: GalleryImage[] = shuffledImages.map((img, index) => {
      let mosaicType: 'normal' | 'large' | 'wide' | 'tall' = 'normal';
      const isLargeMosaic = index > 0 && index % 3 === 0;
      const isWideMosaic =
        index > 0 && img.orientation === 'horizontal' && index % 4 < 2;
      const isTallMosaic = index > 0 && index % 9 === 2;

      if (isLargeMosaic) mosaicType = 'large';
      else if (isWideMosaic) mosaicType = 'wide';
      else if (isTallMosaic) mosaicType = 'tall';
      return {
        ...img,
        orientation: img.orientation || 'vertical',
        mosaicType,
      };
    });

    return processedImages;
  } catch (err) {
    console.error('[fetchGalleryImages] Exception', err);
    return null;
  }
}