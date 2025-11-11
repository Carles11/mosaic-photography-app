/**
 * Converts any image filename to .webp for resized folders.
 * Leaves the extension untouched ONLY for originals and originalsWEBP.
 */
export function convertToWebpExtension(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png|tif|tiff|png|bmp)$/i, ".webp");
}
