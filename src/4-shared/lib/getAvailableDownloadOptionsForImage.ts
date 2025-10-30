import {
  S3_SIZE_WIDTHS,
  convertToWebpExtension,
} from "./getBestS3FolderForWidth";

type GalleryImage = {
  base_url: string;
  filename: string;
  width?: number;
  height?: number;
  print_quality?: string;
};

export type DownloadOption = {
  label: string;
  url: string;
  folder: string;
  width: number | null;
  format: string;
  isOriginal: boolean;
};

export function getAvailableDownloadOptionsForImage(
  image: GalleryImage
): DownloadOption[] {
  const { base_url, filename, width = 1920, print_quality } = image;
  const availableSizes = S3_SIZE_WIDTHS.filter((w) => w <= width);

  const options: DownloadOption[] = [];

  // Add resized webp folders (w400, w600, ...)
  for (const size of availableSizes) {
    options.push({
      label: `Download ${size}px (webp)`,
      url: `${base_url}/w${size}/${convertToWebpExtension(filename)}`,
      folder: `w${size}`,
      width: size,
      format: "webp",
      isOriginal: false,
    });
  }

  // originalsWEBP (same as original size, but webp)
  options.push({
    label: `Download original size (webp)`,
    url: `${base_url}/originalsWEBP/${convertToWebpExtension(filename)}`,
    folder: "originalsWEBP",
    width,
    format: "webp",
    isOriginal: false,
  });

  // originals (original format, always available)
  const originalExt = filename.split(".").pop() || "jpg";
  let originalLabel = "Download original";
  if (["excellent", "professional"].includes(print_quality || "")) {
    originalLabel += " — Best for print";
  }
  originalLabel += ` (${width}w ${originalExt.toUpperCase()})`;

  options.push({
    label: originalLabel,
    url: `${base_url}/originals/${filename}`,
    folder: "originals",
    width,
    format: originalExt.toLowerCase(),
    isOriginal: true,
  });

  return options;
}
