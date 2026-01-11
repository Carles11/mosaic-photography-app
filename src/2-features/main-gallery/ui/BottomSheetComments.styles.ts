import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheetView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 12,
  },
  commentsTitle: {
    marginBottom: 8,
  },
  loadingIndicator: {
    marginTop: 16,
  },
  emptyText: {
    marginTop: 16,
  },
  commentsList: {
    gap: 8,
  },
  commentItem: {
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  commentInfo: {
    flex: 1,
    width: "100%",
  },
  commentDate: {
    fontSize: 10,
    marginTop: 6,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  editActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  editButton: {
    marginRight: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  deleteButton: {
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  reportButtonIcon: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },

  // Footer / input row
  inputRow: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: "#fff",
    minHeight: 44,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loginText: {
    marginTop: 12,
    color: "#999",
  },
  closeButton: {
    marginTop: 12,
  },
});
