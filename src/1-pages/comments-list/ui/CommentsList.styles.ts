import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    alignItems: "flex-start",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  imageInfo: {
    flex: 1,
    marginLeft: 8,
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
  imageYear: {
    fontSize: 12,
    marginBottom: 2,
  },
  menuItemText: {
    fontSize: 15,
    marginBottom: 2,
  },
  thumbnail: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  commentDate: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 4,
  },
  commentActions: {
    flexDirection: "row",
    marginTop: 6,
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "transparent",
    borderRadius: 8,
  },
  editLabel: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: "600",
    color: "#444",
  },
  editTextArea: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    minHeight: 40,
    marginBottom: 8,
    fontSize: 15,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 4,
  },

  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 14,
    color: "#666",
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
