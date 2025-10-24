import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 40,
  },
  imageCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageInfo: {
    flex: 1,
    marginRight: 12,
  },
  imageAuthor: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  imageDescription: {
    fontSize: 14,
    marginBottom: 2,
  },
  imageYear: {
    fontSize: 12,
    marginBottom: 2,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
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
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    maxWidth: 260,
  },
});
