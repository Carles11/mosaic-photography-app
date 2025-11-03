import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sheetView: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: 16,
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
  commentItem: {
    paddingVertical: 8,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
  },
  commentInfo: {
    flex: 1,
    width: "100%",
  },
  commentDate: {
    fontSize: 10,
  },
  editActions: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
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
  inputRow: {
    flexDirection: "row",
    marginTop: 33,
  },
  textInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  sendButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  loginText: {
    marginTop: 16,
    color: "#999",
  },
  closeButton: {
    marginTop: 24,
  },
});
