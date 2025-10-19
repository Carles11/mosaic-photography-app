import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
  },
  imageHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 8,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loading: {
    color: "#fff",
    fontSize: 18,
  },
  error: {
    color: "#ff3333",
    fontSize: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  mosaicTitle: {
    paddingLeft: 8,
    marginBottom: 4,
    fontSize: 12,
    textAlign: "center",
  },
  title: {
    padding: 4,
    marginBottom: 4,
    fontSize: 14,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  galleryList: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 32, // extra space for bottom safe area or modals
  },
});
