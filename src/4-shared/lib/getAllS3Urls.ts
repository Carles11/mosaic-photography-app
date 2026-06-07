import { S3_SIZE_WIDTHS } from "@/4-shared/constants";
import { convertToWebpExtension } from "./convertToWebExtension";

export function getAllS3Urls(image: {
  base_url?: string;
  filename?: string;
  width?: number;
}): Array<{ url: string; width: number }> {
  const imgWidth = image.width ?? 800;
  const imgFilename = image.filename ?? "";
  const imgBaseUrl = image.base_url ?? "";
  if (!imgBaseUrl || !imgFilename) return [];

  return S3_SIZE_WIDTHS.filter((w) => w <= imgWidth)
    .map((w) => ({
      url: `${imgBaseUrl}/w${w}/${convertToWebpExtension(imgFilename)}`,
      width: w,
    }))
    .concat([
      {
        url: `${imgBaseUrl}/originalsWEBP/${convertToWebpExtension(imgFilename)}`,
        width: imgWidth,
      },
    ]);
}

export function getBestUrlForWidth(
  s3Progressive: Array<{ url: string; width: number }>,
  renderedWidth: number,
): string {
  if (!s3Progressive || s3Progressive.length === 0) return "";
  const larger = s3Progressive.filter((s) => s.width >= renderedWidth);
  return larger.length > 0
    ? larger[0].url
    : s3Progressive[s3Progressive.length - 1].url;
}
