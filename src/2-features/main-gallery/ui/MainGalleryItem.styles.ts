import { StyleSheet } from "react-native";

export function createMainGalleryItemStyles(
  itemHeight: number,
  imageHeight: number,
) {
  return StyleSheet.create({
    itemContainer: {
      height: itemHeight,
      borderRadius: 8,
      borderBottomWidth: 1,
      borderBottomColor: "#ececec",
      overflow: "hidden",
      shadowColor: "#dedede",
      shadowOpacity: 0.08,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      marginBottom: 24,
    },
    image: {
      width: "100%",
      height: imageHeight,
      borderRadius: 0,
    },
    title: {
      fontSize: 15,
      fontWeight: "bold",
      marginHorizontal: 12,
      marginBottom: 10,
    },
    author: {
      fontSize: 12,
      marginTop: 6,
      marginHorizontal: 12,
      opacity: 0.85,
      fontStyle: "italic",
    },
    imagePlaceholder: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#eaeaea",
      zIndex: 2,
    },
    footerRowContainer: {
      marginTop: 6,
      marginBottom: 8,
    },
    error: {
      color: "#B00020",
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
  });
}
