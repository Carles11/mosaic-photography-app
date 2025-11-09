import { GALLERY_ITEM_HEIGHT, IMAGE_HEIGHT } from "@/4-shared/constants";
import { StyleSheet } from "react-native";
// Define your gallery item fixed height

export const styles = StyleSheet.create({
  itemContainer: {
    height: GALLERY_ITEM_HEIGHT,
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
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT, // fixed height for the image
    borderRadius: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
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
});
