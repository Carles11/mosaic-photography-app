import { S3_SIZE_WIDTHS } from "@/4-shared/constants";

import { convertToWebpExtension } from "./convertToWebExtension";
/**
 * Returns the best S3 folder and URL for an image given device/rendered width.
 * Assumes the image object has `width`, `filename`, and `base_url` fields.
 * Never upscales images beyond their original width.
 * - For resized folders (w400, w600, ...), always returns a .webp filename.
 * - For originals and originalsWEBP, keeps the original extension.
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
  let folder = availableSizes.includes(bestSize)
    ? `w${bestSize}`
    : "originalsWEBP";

  // Only originals and originalsWEBP keep original extension, all others must be .webp
  let filename = imgFilename;
  if (folder.startsWith("w")) {
    filename = convertToWebpExtension(imgFilename);
  }
  // (If ever using originalsWEBP, it's already webp, originals keeps original extension)
  // Defensive: originalsWEBP should already be correct

  return {
    url: imgBaseUrl && filename ? `${imgBaseUrl}/${folder}/${filename}` : "",
    width: bestSize,
    folder,
    filename,
  };
}
