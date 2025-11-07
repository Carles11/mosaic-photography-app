import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  flatListContent: {
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundText: {
    color: "#c00",
    fontSize: 18,
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: 12,
    paddingBottom: 8,
  },
  year: {
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: 12,
    paddingBottom: 8,
  },
  lifespan: {
    fontSize: 16,
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  timelineContainer: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionContent: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  biography: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 18,
    paddingLeft: 4,
  },
  galleryCount: {
    fontSize: 16,
    fontWeight: "normal",
    opacity: 0.7,
  },
  // Gallery styles for FlatList renderItem
  galleryImageWrapper: {
    alignItems: "center",
    borderRadius: 4,
    overflow: "hidden",
    elevation: 2,
    width: "100%",
  },
  galleryImage: {
    borderRadius: 4,
  },
  imageYear: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  imageDescription: {
    fontSize: 14,
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  shareButton: {
    marginVertical: 24,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#2F3542", // Example dark theme
    alignItems: "center",
  },
  shareButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
