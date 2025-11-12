import {
  MOBILE_PHOTOGRAPHER_HEADER_HEIGHT_RATIO,
  MOBILE_PHOTOGRAPHER_ITEM_HEIGHT,
  PHOTOGRAPHER_GALLERY_DESCRIPTION_HEIGHT,
  PHOTOGRAPHER_GALLERY_FOOTER_HEIGHT,
  PHOTOGRAPHER_GALLERY_YEAR_HEIGHT,
  PHOTOGRAPHER_HEADER_IMAGE_WIDTH_RATIO,
  TABLET_BREAKPOINT,
  TABLET_PHOTOGRAPHER_HEADER_HEIGHT_RATIO,
  TABLET_PHOTOGRAPHER_ITEM_HEIGHT,
} from "@/4-shared/constants";
import { useWindowDimensions } from "react-native";

export function useResponsivePhotographerHeader() {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;

  const headerWidth = width;
  const headerHeight =
    height *
    (!isTablet
      ? MOBILE_PHOTOGRAPHER_HEADER_HEIGHT_RATIO
      : TABLET_PHOTOGRAPHER_HEADER_HEIGHT_RATIO);
  const headerImageWidth = width * PHOTOGRAPHER_HEADER_IMAGE_WIDTH_RATIO;
  const fadeStart = headerHeight * (2 / 3);
  const fadeHeight = headerHeight - fadeStart;

  const galleryItemHeight = isTablet
    ? TABLET_PHOTOGRAPHER_ITEM_HEIGHT
    : MOBILE_PHOTOGRAPHER_ITEM_HEIGHT;

  const galleryYearHeight = PHOTOGRAPHER_GALLERY_YEAR_HEIGHT;
  const galleryDescriptionHeight = PHOTOGRAPHER_GALLERY_DESCRIPTION_HEIGHT;
  const galleryFooterHeight = PHOTOGRAPHER_GALLERY_FOOTER_HEIGHT;

  const galleryImageHeight =
    galleryItemHeight -
    galleryYearHeight -
    galleryDescriptionHeight -
    galleryFooterHeight;

  return {
    isTablet,
    headerWidth,
    headerHeight,
    headerImageWidth,
    fadeStart,
    fadeHeight,
    galleryItemHeight,
    galleryYearHeight,
    galleryDescriptionHeight,
    galleryFooterHeight,
    galleryImageHeight,
  };
}
