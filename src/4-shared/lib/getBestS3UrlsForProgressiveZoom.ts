import { S3_SIZE_WIDTHS } from "@/4-shared/constants";
import { getBestS3FolderForWidth } from "./getBestS3FolderForWidth";
/**
 * Returns both a preview (progressive) and a zoom (full) S3 URL for an image,
 * based on device or rendered width.
 *
 * - Preview: the largest available S3 size ≤ 600px (progressive, quick to load)
 * - Zoom: the nearest S3 size ≥ deviceWidth (but never upscaling above original)
 *
 * @param image { width, filename, base_url }
 * @param deviceWidth The width in pixels to target for zoom (usually device screen width)
 * @returns { previewUrl, zoomUrl, previewWidth, zoomWidth }
 */
export function getBestS3UrlsForProgressiveZoom(
  image: { width?: number; filename: string; base_url: string },
  deviceWidth: number
): {
  previewUrl: string;
  zoomUrl: string;
  previewWidth: number;
  zoomWidth: number;
  previewFolder: string;
  zoomFolder: string;
  previewFilename: string;
  zoomFilename: string;
} {
  // 1. Find preview (largest size ≤ 600px, never upscaling)
  const previewWidth =
    S3_SIZE_WIDTHS.filter(
      (w) => w <= 600 && (!image.width || w <= image.width)
    ).slice(-1)[0] || S3_SIZE_WIDTHS[0];

  const preview = getBestS3FolderForWidth(image, previewWidth);

  // 2. Find zoom (nearest size ≥ deviceWidth, but not upscaling)
  const zoomWidth =
    S3_SIZE_WIDTHS.filter(
      (w) => w >= deviceWidth && (!image.width || w <= image.width)
    )[0] ||
    S3_SIZE_WIDTHS.filter((w) => !image.width || w <= image.width).slice(
      -1
    )[0] ||
    (image.width ?? 1920);

  const zoom = getBestS3FolderForWidth(image, zoomWidth);

  return {
    previewUrl: preview.url,
    zoomUrl: zoom.url,
    previewWidth: preview.width,
    zoomWidth: zoom.width,
    previewFolder: preview.folder,
    zoomFolder: zoom.folder,
    previewFilename: preview.filename,
    zoomFilename: zoom.filename,
  };
}
