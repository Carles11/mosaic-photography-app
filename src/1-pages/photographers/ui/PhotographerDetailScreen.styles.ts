import { Dimensions, StyleSheet } from "react-native";

const { width: deviceWidth } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  flatListContent: {
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
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
    color: "#666",
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
    color: "#444",
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
    color: "#222",
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
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 12,
    elevation: 2,
  },
  galleryImage: {
    width: deviceWidth - 24,
    height: (deviceWidth - 24) * 0.7,
    borderRadius: 10,
    backgroundColor: "#eaeaea",
  },
  imageYear: {
    marginTop: 8,
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  imageDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    marginTop: 4,
    paddingHorizontal: 8,
    textAlign: "center",
  },
});
