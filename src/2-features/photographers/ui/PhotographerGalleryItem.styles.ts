import { StyleSheet } from "react-native";

export function createPhotographerGalleryItemStyles(
  itemHeight: number,
  imageHeight: number,
  yearHeight: number,
  descriptionHeight: number,
  footerHeight: number,
) {
  return StyleSheet.create({
    galleryImageWrapper: {
      alignItems: "center",
      borderRadius: 4,
      overflow: "hidden",
      elevation: 2,
      width: "100%",
      height: itemHeight,
      position: "relative",
    },
    galleryImage: {
      width: "100%",
      height: imageHeight,
      borderRadius: 4,
    },
    imageYear: {
      height: yearHeight,
      fontWeight: "600",
      fontSize: 15,
      textAlign: "center",
      paddingHorizontal: 8,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    imageDescription: {
      height: descriptionHeight,
      fontSize: 14,
      textAlign: "center",
      paddingHorizontal: 8,
      includeFontPadding: false,
      textAlignVertical: "center",
    },
    footerRowContainer: {
      height: footerHeight,
    },
  });
}
