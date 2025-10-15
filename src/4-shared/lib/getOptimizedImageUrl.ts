import { Dimensions, PixelRatio } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const pixelDensity = PixelRatio.get();
const effectiveWidth = screenWidth * pixelDensity;

function selectSizeFolder(width: number): string {
  if (width < 500) return 'w400';
  if (width < 700) return 'w600';
  if (width < 900) return 'w800';
  if (width < 1300) return 'w1200';
  return 'w1600';
}

type GetOptimizedImageUrlOptions = {
  photographerFolder: string;   // e.g. "Ansel-Adams"
  filename: string;            // e.g. "image.jpg"
  basePath?: string;           // e.g. "mosaic-collections/public-domain-collection"
  forceSize?: 'originals' | 'originalsWEBP' | 'w400' | 'w600' | 'w800' | 'w1200' | 'w1600';
};

/**
 * Returns the optimal image url for any gallery/image, converting to .webp for non-originals.
 */
function trimSlashes(str: string) {
  return str.replace(/^\/+|\/+$/g, '');
}

export function getOptimizedImageUrl({
  photographerFolder,
  filename,
  basePath = 'mosaic-collections/public-domain-collection',
  forceSize,
}: GetOptimizedImageUrlOptions): string {
  const sizeFolder = forceSize || selectSizeFolder(effectiveWidth);

  // If not "originals", convert extension to .webp
  let finalFilename = filename;
  if (sizeFolder !== 'originals') {
    const dotIdx = filename.lastIndexOf('.');
    finalFilename = dotIdx !== -1 ? filename.substring(0, dotIdx) + '.webp' : filename + '.webp';
  }

  // Sanitize all segments
  const sanitizedBasePath = trimSlashes(basePath);
  const sanitizedPhotographerFolder = trimSlashes(photographerFolder);

  return `https://cdn.mosaic.photography/${sanitizedBasePath}/${sanitizedPhotographerFolder}/${sizeFolder}/${finalFilename}`;
}