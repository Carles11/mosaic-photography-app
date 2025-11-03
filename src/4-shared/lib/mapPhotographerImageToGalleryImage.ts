import { GalleryImage, PhotographerImage } from "@/4-shared/types";

export function mapPhotographerImageToGalleryImage(
  image: PhotographerImage,
  slug: string = ""
): GalleryImage {
  return {
    id: Number(image.id),
    base_url: image.base_url,
    filename: image.filename,
    author: image.author ?? "", // You can pass photographer.author here
    title: image.title ?? "",
    description: image.description ?? "",
    created_at: "", // Not available, leave empty or add if you fetch it
    orientation: "landscape", // Not always present, default to "landscape"
    width: image.width ?? 0,
    height: 0, // Not available, fallback to 0
    print_quality: "",
    gender: "",
    color: "",
    nudity: "",
    year: image.year ?? undefined,
    url: image.url,
    thumbnailUrl: image.url, // fallback to main url
    mosaicType: "normal",
  };
}

export function mapPhotographerImagesToGalleryImages(
  images: PhotographerImage[] = [],
  slug: string = ""
): GalleryImage[] {
  return images.map((img) => mapPhotographerImageToGalleryImage(img, slug));
}
