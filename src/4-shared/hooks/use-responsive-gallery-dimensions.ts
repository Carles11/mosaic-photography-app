import {
  GALLERY_FOOTER_ROW_HEIGHT,
  GALLERY_TITLE_HEIGHT,
  IMAGE_HEADER_HEIGHT,
  MOBILE_GALLERY_ITEM_HEIGHT,
  TABLET_BREAKPOINT,
  TABLET_GALLERY_ITEM_HEIGHT,
} from "@/4-shared/constants/dimensions";
import { useWindowDimensions } from "react-native";

export function useResponsiveGalleryDimensions() {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  const galleryItemHeight = isTablet
    ? TABLET_GALLERY_ITEM_HEIGHT
    : MOBILE_GALLERY_ITEM_HEIGHT;
  const imageHeight =
    galleryItemHeight -
    IMAGE_HEADER_HEIGHT -
    GALLERY_TITLE_HEIGHT -
    GALLERY_FOOTER_ROW_HEIGHT;

  return {
    isTablet,
    galleryItemHeight,
    imageHeight,
  };
}
