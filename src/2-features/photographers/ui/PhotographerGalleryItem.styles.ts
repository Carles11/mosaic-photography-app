import {
  PHOTOGRAPHER_DETAILS_GALLERY_DESCRIPTION_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_FOOTER_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_IMAGE_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_ITEM_HEIGHT,
  PHOTOGRAPHER_DETAILS_GALLERY_YEAR_HEIGHT,
} from "@/4-shared/constants";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  galleryImageWrapper: {
    alignItems: "center",
    borderRadius: 4,
    overflow: "hidden",
    elevation: 2,
    width: "100%",
    height: PHOTOGRAPHER_DETAILS_GALLERY_ITEM_HEIGHT,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: PHOTOGRAPHER_DETAILS_GALLERY_IMAGE_HEIGHT,
    borderRadius: 4,
  },
  imageYear: {
    height: PHOTOGRAPHER_DETAILS_GALLERY_YEAR_HEIGHT,
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
    paddingHorizontal: 8,
    marginVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  imageDescription: {
    height: PHOTOGRAPHER_DETAILS_GALLERY_DESCRIPTION_HEIGHT,
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 8,
    marginVertical: 0,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  footerRowContainer: {
    height: PHOTOGRAPHER_DETAILS_GALLERY_FOOTER_HEIGHT,
  },
});
