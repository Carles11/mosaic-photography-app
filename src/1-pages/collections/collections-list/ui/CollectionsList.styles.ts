import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  header: {
    marginBottom: 14,
    flexDirection: "column",
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  createButton: {
    alignSelf: "flex-start",
    marginTop: 6,
    marginBottom: 2,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  collectionCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  cardPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    minWidth: 80,
    marginRight: 13,
  },
  previewThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 5,
  },
  emptyThumb: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyThumbIcon: {
    fontSize: 24,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  collectionName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  collectionDescription: {
    fontSize: 13,
    marginBottom: 4,
  },
  imageCount: {
    fontSize: 12,
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

  editActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },
});
