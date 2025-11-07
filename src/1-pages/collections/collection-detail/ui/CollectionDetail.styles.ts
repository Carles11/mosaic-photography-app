import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  header: {
    marginBottom: 12,
    alignItems: "flex-start",
  },

  description: {
    fontSize: 15,
    marginBottom: 4,
  },
  imageCount: {
    fontSize: 13,
    marginBottom: 6,
  },
  imagesGrid: {
    paddingBottom: 36,
    gap: 8,
  },
  imageCard: {
    borderRadius: 12,
    margin: 6,
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    minWidth: 0,
    maxWidth: "48%",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  imageAuthor: {
    fontSize: 12,
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 14,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
    textAlign: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 260,
    alignSelf: "center",
  },
});
