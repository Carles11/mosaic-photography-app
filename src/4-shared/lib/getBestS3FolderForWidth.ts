// S3 sizes available, always webp for resized folders except originals
export const S3_SIZE_WIDTHS = [400, 600, 800, 1200, 1600];

// Converts any image filename to .webp for resized folders
export function convertToWebpExtension(filename: string): string {
  return filename.replace(/\.(jpg|jpeg|png|tif|tiff)$/i, ".webp");
}

/**
 * Returns the best S3 folder and URL for an image given device/rendered width.
 * Assumes the image object has `width`, `filename`, and `base_url` fields.
 * Never upscales images beyond their original width.
 */
export function getBestS3FolderForWidth(
  image: { width?: number; filename: string; base_url: string },
  renderedWidth: number
): { url: string; width: number; folder: string; filename: string } {
  const imgWidth = image.width ?? 1920;
  const imgFilename = image.filename ?? "";
  const imgBaseUrl = image.base_url ?? "";

  // Only include sizes that exist for this image (never upscaling)
  const availableSizes = S3_SIZE_WIDTHS.filter((w) => w <= imgWidth);

  // Find the smallest available S3 size >= renderedWidth, or largest available
  const largerOrEqual = availableSizes.filter((w) => w >= renderedWidth);
  const bestSize =
    largerOrEqual.length > 0
      ? largerOrEqual[0]
      : availableSizes.length > 0
      ? availableSizes[availableSizes.length - 1]
      : imgWidth;

  // If bestSize equals imgWidth and it's not in availableSizes, use originalsWEBP
  const folder = availableSizes.includes(bestSize)
    ? `w${bestSize}`
    : "originalsWEBP";
  const filename =
    folder.startsWith("w") ? convertToWebpExtension(imgFilename) : imgFilename;
  return {
    url:
      imgBaseUrl && filename
        ? `${imgBaseUrl}/${folder}/${filename}`
        : "",
    width: bestSize,
    folder,
    filename,
  };
}